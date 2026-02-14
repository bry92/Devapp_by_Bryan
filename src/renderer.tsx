import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Forge AI Builder</h1>
      <p>Renderer is working.</p>
      <Analytics />
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
