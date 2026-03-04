import { useMemo, useState } from "react";
import { applyPromptUpdate, createBlueprintFromPrompt, validateProject } from "../engine/aiBuilder.js";
import { generateProjectFiles } from "../engine/projectGenerator.mjs";

const LOCAL_STORAGE_KEY = "vibe-code-forge-project";

export default function PreviewPage() {
  const [prompt, setPrompt] = useState("Build a task manager with dark mode.");
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [blueprint, setBlueprint] = useState(() => createBlueprintFromPrompt("Build a task manager"));
  const [activeScreen, setActiveScreen] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({ generated: 0, totalMs: 0, exports: 0, failures: 0 });

  const files = useMemo(() => generateProjectFiles(blueprint), [blueprint]);
  const validation = useMemo(() => validateProject(files), [files]);
  const fileNames = Object.keys(files);
  const currentFile = selectedFile || fileNames[0] || "";

  async function handleGenerate() {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setError("Please describe the app you want to build.");
      return;
    }

    setError("");
    setIsGenerating(true);
    const start = performance.now();

    try {
      const nextBlueprint = await requestGeneratedBlueprint(cleanPrompt);
      const nextFiles = generateProjectFiles(nextBlueprint);
      const nextValidation = validateProject(nextFiles);
      if (!nextValidation.valid) {
        throw new Error(nextValidation.error);
      }

      setBlueprint(nextBlueprint);
      setPromptHistory((history) => [cleanPrompt, ...history].slice(0, 8));
      persistProject(nextBlueprint, nextFiles);
      setSelectedFile("");
      const duration = Math.round(performance.now() - start);
      setMetrics((prev) => ({ ...prev, generated: prev.generated + 1, totalMs: prev.totalMs + duration }));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Generation failed.");
      setMetrics((prev) => ({ ...prev, failures: prev.failures + 1 }));
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSimpleEdit(field, value) {
    setBlueprint((prev) => ({ ...prev, [field]: value }));
  }

  function handleImprove() {
    if (!updatePrompt.trim()) return;
    const next = applyPromptUpdate(blueprint, updatePrompt);
    setBlueprint(next);
    setPromptHistory((history) => [`Improve: ${updatePrompt}`, ...history].slice(0, 8));
    persistProject(next, generateProjectFiles(next));
    setUpdatePrompt("");
  }

  function handleExport() {
    const payload = JSON.stringify({ blueprint, files }, null, 2);
    downloadTextFile(payload, `${toKebabCase(blueprint.name)}-project.json`, "application/json");
    setMetrics((prev) => ({ ...prev, exports: prev.exports + 1 }));
  }

  async function handleCopy() {
    const merged = fileNames.map((name) => `// FILE: ${name}\n${files[name]}`).join("\n\n");
    await navigator.clipboard.writeText(merged);
  }

  const avgMs = metrics.generated > 0 ? Math.round(metrics.totalMs / metrics.generated) : 0;
  const successRate = metrics.generated + metrics.failures > 0
    ? Math.round((metrics.generated / (metrics.generated + metrics.failures)) * 100)
    : 100;

  return (
    <div style={pageStyle}>
      <section style={panelStyle}>
        <h2 style={titleStyle}>1) Describe your app</h2>
        <p style={subtleStyle}>Minimal AI app builder MVP: prompt → files → preview → edit → export.</p>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} style={textAreaStyle} />
        <button onClick={() => void handleGenerate()} disabled={isGenerating} style={buttonStyle}>
          {isGenerating ? "Generating..." : "Generate App"}
        </button>
        <textarea
          value={updatePrompt}
          onChange={(event) => setUpdatePrompt(event.target.value)}
          style={{ ...textAreaStyle, minHeight: 80, marginTop: 8 }}
          placeholder='Try: "Add login page" or "Add dark mode"'
        />
        <button onClick={handleImprove} style={secondaryButtonStyle}>Regenerate / Improve</button>
        {error ? <p style={{ ...subtleStyle, color: "#fda4af" }}>{error}</p> : null}
        {!validation.valid ? <p style={{ ...subtleStyle, color: "#fda4af" }}>{validation.error}</p> : null}
        <p style={subtleStyle}>Prompt history: {promptHistory.join(" • ") || "No prompts yet."}</p>
      </section>

      <section style={panelStyle}>
        <h2 style={titleStyle}>2) Live preview + simple editor</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <label style={labelStyle}>App name<input value={blueprint.name} onChange={(event) => handleSimpleEdit("name", event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Primary color<input value={blueprint.primaryColor} onChange={(event) => handleSimpleEdit("primaryColor", event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Headline<input value={blueprint.heroText} onChange={(event) => handleSimpleEdit("heroText", event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Button text<input value={blueprint.buttonLabel} onChange={(event) => handleSimpleEdit("buttonLabel", event.target.value)} style={inputStyle} /></label>
        </div>

        <div style={previewFrameStyle}>
          <div style={previewTopBarStyle}>
            <strong>{blueprint.name}</strong>
            <span>{blueprint.theme} • {blueprint.layout}</span>
          </div>
          <div style={{ ...previewBodyStyle, background: blueprint.theme === "dark" ? "#0f172a" : "#f8fafc", color: blueprint.theme === "dark" ? "#e2e8f0" : "#0f172a" }}>
            <h3 style={{ marginTop: 0 }}>{blueprint.heroText}</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {blueprint.screens.map((screen, index) => (
                <button key={screen.id} onClick={() => setActiveScreen(index)} style={{ ...screenButtonStyle, background: index === activeScreen ? blueprint.primaryColor : "#475569" }}>
                  {screen.title}
                </button>
              ))}
            </div>
            <button style={{ ...screenButtonStyle, background: blueprint.primaryColor }}>{blueprint.buttonLabel}</button>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={titleStyle}>3) Code + export</h2>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 8, minHeight: 320 }}>
          <div style={fileListStyle}>
            {fileNames.map((name) => (
              <button key={name} onClick={() => setSelectedFile(name)} style={{ ...fileButtonStyle, borderColor: name === currentFile ? blueprint.primaryColor : "rgba(255,255,255,0.08)" }}>
                {name}
              </button>
            ))}
          </div>
          <pre style={preStyle}>{files[currentFile]}</pre>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={handleExport} style={buttonStyle}>Download Project</button>
          <button onClick={() => void handleCopy()} style={secondaryButtonStyle}>Copy GitHub-ready files</button>
        </div>
        <p style={subtleStyle}>Metrics: apps generated {metrics.generated}, avg generation {avgMs}ms, exports {metrics.exports}, prompt success {successRate}%.</p>
      </section>
    </div>
  );
}

async function requestGeneratedBlueprint(prompt) {
  const endpoint = import.meta.env.VITE_GENERATE_API_URL;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload?.blueprint) return payload.blueprint;
      }
    } catch {
      // Silent fallback to local generation for MVP reliability.
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 550));
  return createBlueprintFromPrompt(prompt);
}

function persistProject(blueprint, files) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ blueprint, files }));
}

function downloadTextFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toKebabCase(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const pageStyle = { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" };
const panelStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 };
const titleStyle = { marginTop: 0, marginBottom: 6 };
const subtleStyle = { fontSize: 13, color: "rgba(255,255,255,0.72)" };
const textAreaStyle = { width: "100%", minHeight: 110, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.2)", color: "#fff", padding: 8, resize: "vertical" };
const buttonStyle = { border: "none", borderRadius: 8, background: "#ff5a1f", color: "#fff", fontWeight: 700, padding: "10px 12px", cursor: "pointer" };
const secondaryButtonStyle = { ...buttonStyle, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" };
const inputStyle = { width: "100%", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)", color: "#fff", padding: 7 };
const labelStyle = { fontSize: 12, display: "grid", gap: 4, color: "rgba(255,255,255,0.8)" };
const previewFrameStyle = { border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", marginTop: 10 };
const previewTopBarStyle = { display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 12, background: "rgba(255,255,255,0.06)" };
const previewBodyStyle = { minHeight: 180, padding: 12 };
const screenButtonStyle = { border: "none", color: "#fff", borderRadius: 8, padding: "7px 10px", cursor: "pointer" };
const fileListStyle = { borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 8 };
const fileButtonStyle = { width: "100%", textAlign: "left", marginBottom: 4, borderRadius: 6, border: "1px solid", background: "rgba(255,255,255,0.03)", color: "#fff", padding: "6px 8px", cursor: "pointer", fontFamily: "monospace", fontSize: 12 };
const preStyle = { margin: 0, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 8, background: "rgba(0,0,0,0.2)", fontFamily: "monospace", fontSize: 12, overflow: "auto" };
