import React from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Forge AI Builder</h1>
      <p>Renderer is working.</p>
      <SpeedInsights />
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
