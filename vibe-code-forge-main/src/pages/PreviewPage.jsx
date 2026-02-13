import { useMemo, useState } from "react";
import { componentMap } from "../engine/componentRegistry.jsx";
import { generateProjectFiles } from "../engine/projectGenerator.mjs";
import { SAMPLE_BLUEPRINT } from "./sampleBlueprint.js";

export default function PreviewPage() {
  const [prompt, setPrompt] = useState("Build a dashboard with users, analytics, and publishing.");
  const [blueprint, setBlueprint] = useState(SAMPLE_BLUEPRINT);
  const [activeScreen, setActiveScreen] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");

  const parsed = useMemo(() => {
    try {
      return JSON.parse(blueprint);
    } catch {
      return null;
    }
  }, [blueprint]);

  const generatedFiles = useMemo(() => {
    if (!parsed) return {};
    try {
      return generateProjectFiles(parsed);
    } catch {
      return {};
    }
  }, [parsed]);

  const fileList = Object.keys(generatedFiles);
  const effectiveSelectedFile = selectedFile || fileList[0] || "";
  const selectedFileContent = effectiveSelectedFile ? generatedFiles[effectiveSelectedFile] : "";

  function generateMockBlueprint() {
    const appName = prompt.trim() ? `App for: ${prompt.trim().slice(0, 24)}` : "Devapp Workspace";
    setBlueprint(
      JSON.stringify(
        {
          ...JSON.parse(SAMPLE_BLUEPRINT),
          name: appName,
        },
        null,
        2
      )
    );
  }

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h2 style={titleStyle}>Prompt</h2>
          <span style={metaBadgeStyle}>AI Input</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the app you want to build..."
          style={textAreaStyle}
        />
        <button onClick={generateMockBlueprint} style={buttonStyle}>
          Generate Blueprint
        </button>
      </div>

      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h2 style={titleStyle}>Blueprint JSON</h2>
          <span style={metaBadgeStyle}>Editable</span>
        </div>
        <textarea
          value={blueprint}
          onChange={(e) => setBlueprint(e.target.value)}
          style={{ ...textAreaStyle, minHeight: 270, fontFamily: mono }}
        />
      </div>

      <div style={{ ...panelStyle, minHeight: 380 }}>
        <div style={panelHeaderStyle}>
          <h2 style={titleStyle}>File Explorer</h2>
          <span style={metaBadgeStyle}>{fileList.length} files</span>
        </div>
        {fileList.length === 0 ? (
          <div style={mutedStyle}>No files generated.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 10, minHeight: 290 }}>
            <div style={fileListStyle}>
              {fileList.map((file) => (
                <div
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  style={{
                    cursor: "pointer",
                    padding: "7px 8px",
                    borderRadius: 6,
                    marginBottom: 4,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background:
                      effectiveSelectedFile === file
                        ? "linear-gradient(90deg, rgba(255,107,43,0.25), rgba(255,107,43,0.08))"
                        : "rgba(255,255,255,0.02)",
                    fontFamily: mono,
                    fontSize: 12,
                  }}
                >
                  {file}
                </div>
              ))}
            </div>
            <div style={codeFrameStyle}>
              <div style={codeHeaderStyle}>
                <span style={{ opacity: 0.8 }}>{effectiveSelectedFile || "Select a file"}</span>
              </div>
              <pre style={preStyle}>{selectedFileContent || "Select a file"}</pre>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...panelStyle, minHeight: 380 }}>
        <div style={panelHeaderStyle}>
          <h2 style={titleStyle}>Live Preview</h2>
          <span style={metaBadgeStyle}>Runtime</span>
        </div>
        {!parsed || !Array.isArray(parsed.screens) || parsed.screens.length === 0 ? (
          <div style={mutedStyle}>Invalid blueprint or no screens found.</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {parsed.screens.map((screen, index) => (
                <button
                  key={screen.id || index}
                  onClick={() => setActiveScreen(index)}
                  style={{
                    ...screenButtonStyle,
                    width: "auto",
                    background: index === activeScreen ? "#ff5a1f" : "rgba(255,255,255,0.08)",
                  }}
                >
                  {screen.title || `Screen ${index + 1}`}
                </button>
              ))}
            </div>
            <div style={previewFrameStyle}>
              <div style={previewTopBarStyle}>
                <span>Devapp Preview</span>
                <span style={{ opacity: 0.65 }}>
                  {parsed.screens[activeScreen]?.title || `Screen ${activeScreen + 1}`}
                </span>
              </div>
              <div style={previewCanvasStyle}>
                {parsed.screens[activeScreen]?.components?.map((comp, index) => {
                  const Comp = componentMap[comp];
                  return Comp ? <Comp key={`${comp}-${index}`} /> : null;
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const mono = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const pageStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(390px, 1fr))",
  gap: 12,
};

const panelStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const panelHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const titleStyle = { margin: 0, fontSize: 17 };

const metaBadgeStyle = {
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 999,
  fontSize: 11,
  padding: "2px 8px",
  color: "rgba(255,255,255,0.8)",
};

const textAreaStyle = {
  width: "100%",
  minHeight: 160,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  background: "rgba(0,0,0,0.3)",
  color: "#fff",
  padding: 10,
  resize: "vertical",
  lineHeight: 1.5,
};

const buttonStyle = {
  marginTop: 8,
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 8,
  background: "#ff5a1f",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const screenButtonStyle = {
  marginTop: 0,
  padding: "6px 10px",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const fileListStyle = {
  borderRight: "1px solid rgba(255,255,255,0.08)",
  paddingRight: 8,
  overflow: "auto",
};

const codeFrameStyle = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  overflow: "hidden",
  background: "rgba(0,0,0,0.22)",
};

const codeHeaderStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontSize: 12,
  fontFamily: mono,
  background: "rgba(255,255,255,0.03)",
};

const preStyle = {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflow: "auto",
  fontFamily: mono,
  fontSize: 12,
  padding: 10,
  maxHeight: 260,
};

const previewFrameStyle = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  overflow: "hidden",
  background: "rgba(0,0,0,0.25)",
};

const previewTopBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 10px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontSize: 12,
  letterSpacing: 0.2,
  background: "rgba(255,255,255,0.03)",
};

const previewCanvasStyle = {
  padding: 12,
  minHeight: 220,
};

const mutedStyle = { color: "rgba(255,255,255,0.66)", fontSize: 13 };
