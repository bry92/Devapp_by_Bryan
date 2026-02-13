import { useMemo, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateProjectFiles } from "../engine/projectGenerator.mjs";
import { SAMPLE_BLUEPRINT } from "./sampleBlueprint.js";

export default function PublishPage({ onBuildApp, buildStatus }) {
  const [backendUrl, setBackendUrl] = useState("https://devapp-by-bryan-1.onrender.com");
  const [frontendUrl, setFrontendUrl] = useState("https://devapp-by-bryan.onrender.com");
  const [status, setStatus] = useState("Idle");

  const generatedFiles = useMemo(() => {
    try {
      return generateProjectFiles(JSON.parse(SAMPLE_BLUEPRINT));
    } catch {
      return {};
    }
  }, []);

  async function exportZip() {
    const zip = new JSZip();
    for (const [path, content] of Object.entries(generatedFiles)) {
      zip.file(path, content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "devapp-export.zip");
  }

  return (
    <div style={panelStyle}>
      <h1 style={{ marginTop: 0 }}>Publish</h1>
      <p style={mutedStyle}>Deployment checklist and release preparation tools.</p>

      <div style={checklistStyle}>
        <label style={labelStyle}>
          Backend URL
          <input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Frontend URL
          <input value={frontendUrl} onChange={(e) => setFrontendUrl(e.target.value)} style={inputStyle} />
        </label>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={async () => {
              setStatus("Build started");
              if (onBuildApp) {
                await onBuildApp();
              }
              setStatus("Build passed");
            }}
            style={buttonStyle}
          >
            Build App
          </button>
          <button onClick={exportZip} style={buttonStyle}>Export ZIP</button>
          <button onClick={() => setStatus("Domain connection flow opened") } style={buttonStyle}>Connect Domain</button>
        </div>

        <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 13 }}>Status: {status}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
          Global Build Status: {buildStatus || "Not started"}
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 14,
};

const checklistStyle = {
  display: "grid",
  gap: 10,
  maxWidth: 760,
  marginTop: 10,
};

const labelStyle = {
  display: "grid",
  gap: 5,
  fontSize: 14,
  color: "rgba(255,255,255,0.85)",
};

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 8,
  background: "rgba(0,0,0,0.3)",
  color: "#fff",
  padding: "10px 12px",
};

const buttonStyle = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const mutedStyle = { color: "rgba(255,255,255,0.72)", marginTop: 0 };
