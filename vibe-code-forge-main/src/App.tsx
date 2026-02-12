

import { useState } from "react";
import { componentMap } from "./engine/componentRegistry.jsx";
import { generateProjectFiles } from "./engine/projectGenerator.mjs";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import devappHero from "./assets/devapp-hero.png";

type BlueprintScreen = {
  id?: string;
  title?: string;
  components?: string[];
};

type Blueprint = {
  name?: string;
  theme?: string;
  screens?: BlueprintScreen[];
};

export default function App() {

  const [prompt, setPrompt] = useState("");
  const [blueprint, setBlueprint] = useState(`{
  "name": "Forge Demo",
  "stack": "react-vite",
  "theme": "dark",
  "structure": {
    "components": ["Header", "PrimaryButton"],
    "pages": ["Home"],
    "lib": ["store.js"]
  },
  "screens": [
    { "id": "home", "title": "Home", "components": ["header", "primaryButton"] }
  ]
}`);
  const [status, setStatus] = useState("Ready");

  function generateBlueprint() {
    setStatus("Generating...");
    // placeholder until you connect OpenRouter
    setTimeout(() => {
      setBlueprint(`{
  "name": "Sleep Tracker",
  "stack": "react-vite",
  "theme": "dark",
  "structure": {
    "components": ["Header", "PrimaryButton"],
    "pages": ["Home"],
    "lib": ["api.js"]
  },
  "screens": [
    { "id": "home", "title": "Dashboard", "components": ["header", "list", "button"] }
  ],
  "data": [
    { "model": "Item", "fields": ["id", "title", "createdAt"] }
  ],
  "actions": ["createItem", "deleteItem"]
}`);
      setStatus("Generated");
    }, 700);
  }

  let parsed: Blueprint | null;
  try {
    parsed = JSON.parse(blueprint) as Blueprint;
  } catch {
    parsed = null;
  }

  // For multi-screen support
  const [activeScreen, setActiveScreen] = useState(0);

  // For generated files panel
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  let generatedFiles: Record<string, string> = {};
  if (parsed) {
    try {
      generatedFiles = generateProjectFiles(parsed);
    } catch {
      generatedFiles = {};
    }
  }
  const fileList = Object.keys(generatedFiles);
  const selectedFileContent = selectedFile ? generatedFiles[selectedFile] : null;

  // ZIP export handler
  async function handleZipExport() {
    if (!parsed) return;
    const files = generateProjectFiles(parsed);
    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${parsed.name ? parsed.name.replace(/\s+/g, "-").toLowerCase() : "forge-app"}.zip`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0f", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ padding: 18, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
          Devapp by Bryan
        </div>
        <div style={{ opacity: 0.7, fontSize: 13 }}>{status}</div>
      </div>

      <div style={{ padding: 12 }}>
        <img
          src={devappHero}
          alt="Devapp hero"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, padding: 12 }}>
        {/* Prompt */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Describe your app</div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Example:\nA simple habit tracker.\nOne screen: list habits.\nButton: add habit.\nStore: title + frequency.`}
            style={{
              width: "100%",
              minHeight: 220,
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: 10,
              resize: "vertical"
            }}
          />
          <button
            onClick={generateBlueprint}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "12px 14px",
              background: "#ff5a1f",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Generate Blueprint
          </button>
        </div>

        {/* Blueprint */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Blueprint (JSON)</div>
          <textarea
            value={blueprint}
            onChange={(e) => setBlueprint(e.target.value)}
            style={{
              width: "100%",
              minHeight: 300,
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: 10,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12
            }}
          />
        </div>

        {/* Preview */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, minHeight: 350 }}>
                  {/* Generated Files */}
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, minHeight: 350, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700 }}>Generated Files</span>
                      <button
                        onClick={handleZipExport}
                        style={{
                          padding: '6px 16px',
                          background: '#ff5a1f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: 13
                        }}
                        disabled={fileList.length === 0}
                        title={fileList.length === 0 ? 'No files to export' : 'Download ZIP'}
                      >
                        Download ZIP
                      </button>
                    </div>
                    {fileList.length === 0 ? (
                      <div style={{ color: '#aaa', fontSize: 13 }}>No files generated.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
                        <div style={{ minWidth: 140, maxWidth: 180, overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.08)', marginRight: 10 }}>
                          {fileList.map((file) => (
                            <div
                              key={file}
                              onClick={() => setSelectedFile(file)}
                              style={{
                                padding: '6px 10px',
                                cursor: 'pointer',
                                background: selectedFile === file ? '#222' : 'none',
                                color: selectedFile === file ? '#ff5a1f' : '#fff',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                fontSize: 13,
                                borderRadius: 6,
                                marginBottom: 2
                              }}
                            >
                              {file}
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'rgba(0,0,0,0.18)', borderRadius: 8, padding: 10, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 13, marginLeft: 4 }}>
                          {selectedFileContent ? (
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{selectedFileContent}</pre>
                          ) : (
                            <span style={{ color: '#888' }}>Select a file to preview its code.</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
          <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Preview</span>
            {parsed && Array.isArray(parsed.screens) && parsed.screens.length > 1 && (
              <div style={{ display: 'flex', gap: 6 }}>
                {parsed.screens.map((screen, idx) => (
                  <button
                    key={screen.id || idx}
                    onClick={() => setActiveScreen(idx)}
                    style={{
                      background: idx === activeScreen ? '#ff5a1f' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    {screen.title || `Screen ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!parsed ? (
            <div style={{ color: "#ff5a1f", fontWeight: 600, marginTop: 20 }}>Invalid JSON. Please check your blueprint.</div>
          ) : !Array.isArray(parsed.screens) || parsed.screens.length === 0 ? (
            <div style={{ color: "#ff5a1f", fontWeight: 600, marginTop: 20 }}>No screens defined in blueprint.</div>
          ) : (
            <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", minHeight: 200 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>
                {parsed.name || "Untitled App"}
                <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>{parsed.theme ? `(${parsed.theme})` : ''}</span>
              </div>

              {/* Render active screen */}
              <div style={{ marginBottom: 10, fontWeight: 700, fontSize: 15, color: '#ff5a1f' }}>
                {parsed.screens[activeScreen]?.title || `Screen ${activeScreen + 1}`}
              </div>

              {parsed.screens[activeScreen]?.components?.length ? (
                parsed.screens[activeScreen].components.map((comp, index) => {
                  const Comp = componentMap[comp];
                  return Comp ? <Comp key={index} /> : null;
                })
              ) : (
                <div style={{ color: '#aaa', fontSize: 13 }}>No components for this screen.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



