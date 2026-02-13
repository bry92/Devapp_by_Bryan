import { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import devappHero from "../assets/devapp-hero.png";
import {
  TAB_GROUPS,
  TAB_PAGE_MAP,
  TAB_DESCRIPTIONS,
} from "../pages/tabs.js";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("Preview");
  const [buildStatus, setBuildStatus] = useState("Not started");

  const ActivePage = TAB_PAGE_MAP[activeTab];
  const activeSection = useMemo(
    () => TAB_GROUPS.find((group) => group.tabs.includes(activeTab))?.section ?? "",
    [activeTab]
  );

  async function handleBuildApp() {
    setBuildStatus("Building...");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setBuildStatus("Build completed");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 700px at 15% -10%, rgba(0,158,255,0.22), transparent), radial-gradient(1000px 700px at 100% 0%, rgba(255,102,0,0.2), transparent), #090b10",
        color: "#ffffff",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <strong style={{ letterSpacing: 0.3 }}>Devapp by Bryan</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
            {activeTab} | {buildStatus}
          </span>
          <button
            onClick={async () => {
              setActiveTab("Publish");
              await handleBuildApp();
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,130,61,0.7)",
              background: "rgba(255,107,43,0.2)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Build App
          </button>
        </div>
      </header>

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 16,
          padding: 16,
        }}
      >
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <section>
          <div style={{ marginBottom: 12 }}>
            <img
              src={devappHero}
              alt="Devapp hero"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>
          <div
            style={{
              marginBottom: 10,
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Section: {activeSection} | {TAB_DESCRIPTIONS[activeTab]} | Build: {buildStatus}
          </div>
          {activeTab === "Publish" ? (
            <ActivePage onBuildApp={handleBuildApp} buildStatus={buildStatus} />
          ) : (
            <ActivePage />
          )}
        </section>
      </main>
    </div>
  );
}
