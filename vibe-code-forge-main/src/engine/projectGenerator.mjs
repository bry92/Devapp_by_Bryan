export function generateProjectFiles(blueprint = {}) {
  const appName = safeString(blueprint.name, "Forge App");
  const screens = normalizeScreens(blueprint.screens);
  const model = pickPrimaryModel(blueprint);
  const actions = normalizeList(blueprint.actions);

  const files = {};

  files["README.md"] = makeReadme(appName, model.name);

  files["client/package.json"] = json({
    name: "client",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      react: "^19.2.0",
      "react-dom": "^19.2.0"
    },
    devDependencies: {
      vite: "^7.2.4"
    }
  });

  files["client/index.html"] = [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `    <title>${escapeHtml(appName)}</title>`,
    "  </head>",
    "  <body>",
    '    <div id="root"></div>',
    '    <script type="module" src="/src/main.jsx"></script>',
    "  </body>",
    "</html>"
  ].join("\n");

  files["client/src/main.jsx"] = [
    'import React from "react";',
    'import ReactDOM from "react-dom/client";',
    'import App from "./App";',
    "",
    "ReactDOM.createRoot(document.getElementById(\"root\")).render(",
    "  <React.StrictMode>",
    "    <App />",
    "  </React.StrictMode>",
    ");"
  ].join("\n");

  files["client/src/App.jsx"] = makeClientApp(appName, screens);

  files["server/package.json"] = json({
    name: "server",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "node src/server.js"
    },
    dependencies: {
      express: "^4.21.2",
      cors: "^2.8.5"
    }
  });

  files["server/src/server.js"] = makeServerFile(model, actions);

  return files;
}

function makeReadme(appName, modelName) {
  return [
    `# ${appName}`,
    "",
    "Generated with Forge.",
    "",
    "## Projects",
    "",
    "- `client`: React + Vite app",
    "- `server`: Express API",
    "",
    "## Primary model",
    "",
    `- ${modelName}`
  ].join("\n");
}

function makeClientApp(appName, screens) {
  const screenNames = screens.map((s) => s.title);
  return [
    'import React from "react";',
    "",
    "export default function App() {",
    `  const appName = ${JSON.stringify(appName)};`,
    `  const screens = ${JSON.stringify(screenNames, null, 2)};`,
    "",
    "  return (",
    '    <main style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>',
    '      <h1 style={{ marginBottom: 8 }}>{appName}</h1>',
    '      <p style={{ marginTop: 0, opacity: 0.75 }}>Generated scaffold preview</p>',
    "      <ul>",
    "        {screens.map((screen) => (",
    "          <li key={screen}>{screen}</li>",
    "        ))}",
    "      </ul>",
    "    </main>",
    "  );",
    "}"
  ].join("\n");
}

function makeServerFile(model, actions) {
  const hasCreate = actions.some((a) => a.toLowerCase().includes("create"));
  const hasDelete = actions.some((a) => a.toLowerCase().includes("delete"));
  const routeBase = `/api/${model.fileName}`;

  const lines = [
    'import express from "express";',
    'import cors from "cors";',
    "",
    "const app = express();",
    "const port = Number(process.env.PORT || 5000);",
    "",
    "app.use(cors());",
    "app.use(express.json());",
    "",
    `const records = []; // ${model.name}[]`,
    "",
    `app.get(\"${routeBase}\", (_req, res) => {`,
    "  res.json(records);",
    "});"
  ];

  if (hasCreate) {
    lines.push(
      "",
      `app.post(\"${routeBase}\", (req, res) => {`,
      "  const item = req.body || {};",
      "  records.push(item);",
      "  res.status(201).json(item);",
      "});"
    );
  }

  if (hasDelete) {
    lines.push(
      "",
      `app.delete(\"${routeBase}/:id\", (req, res) => {`,
      "  const id = String(req.params.id);",
      "  const index = records.findIndex((x) => String(x.id) === id);",
      "  if (index === -1) {",
      "    res.status(404).json({ error: \"Not found\" });",
      "    return;",
      "  }",
      "  const [removed] = records.splice(index, 1);",
      "  res.json(removed);",
      "});"
    );
  }

  lines.push(
    "",
    "app.listen(port, () => {",
    "  console.log(`API listening on :${port}`);",
    "});"
  );

  return lines.join("\n");
}

function pickPrimaryModel(blueprint) {
  const fromModels = normalizeModels(blueprint.models);
  if (fromModels.length > 0) {
    return fromModels[0];
  }

  const fromData = normalizeDataModels(blueprint.data);
  if (fromData.length > 0) {
    return fromData[0];
  }

  return { name: "Item", fileName: "items" };
}

function normalizeModels(models) {
  if (!Array.isArray(models)) return [];

  return models
    .map((m) => {
      const rawName = typeof m === "string" ? m : m?.name;
      const name = toPascalCase(rawName || "");
      if (!name) return null;
      return {
        name,
        fileName: toKebabCase(name) + "s"
      };
    })
    .filter(Boolean);
}

function normalizeDataModels(data) {
  if (!Array.isArray(data)) return [];

  return data
    .map((entry) => {
      const name = toPascalCase(entry?.model || entry?.name || "");
      if (!name) return null;
      return {
        name,
        fileName: toKebabCase(name) + "s"
      };
    })
    .filter(Boolean);
}

function normalizeScreens(screens) {
  if (!Array.isArray(screens) || screens.length === 0) {
    return [{ title: "Home" }];
  }

  return screens.map((screen, index) => ({
    title: safeString(screen?.title, `Screen ${index + 1}`)
  }));
}

function normalizeList(value) {
  return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
}

function safeString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toPascalCase(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function toKebabCase(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function json(value) {
  return JSON.stringify(value, null, 2);
}
