import { BONUS_UPGRADE, ROADMAP_UPGRADES } from "./roadmapUpgrades.js";

export default function OverviewPage() {
  return (
    <div style={wrapStyle}>
      <section style={heroStyle}>
        <h1 style={{ margin: "0 0 6px", fontSize: 30 }}>AI Builder Competitor Roadmap</h1>
        <p style={subtleTextStyle}>
          Your MVP now validates the core loop. These are the 5 upgrades that move it toward a serious AI app-builder competitor.
        </p>
      </section>

      <section style={gridStyle}>
        {ROADMAP_UPGRADES.map((upgrade) => (
          <article key={upgrade.id} style={cardStyle}>
            <h2 style={{ marginTop: 0, fontSize: 19 }}>{upgrade.title}</h2>
            <p style={subtleTextStyle}>{upgrade.value}</p>
            <ul style={listStyle}>
              {upgrade.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section style={bonusStyle}>
        <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>{BONUS_UPGRADE.title}</h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.8)" }}>{BONUS_UPGRADE.value}</p>
      </section>
    </div>
  );
}

const wrapStyle = {
  display: "grid",
  gap: 12,
};

const heroStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 18,
};

const gridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 14,
};

const listStyle = {
  marginBottom: 0,
  paddingLeft: 18,
  color: "rgba(255,255,255,0.85)",
};

const subtleTextStyle = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
};

const bonusStyle = {
  background: "linear-gradient(180deg, rgba(255,90,31,0.2), rgba(255,90,31,0.08))",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 16,
};
