const MAX_FILES = 25;
const MAX_LINES = 10000;

export function createBlueprintFromPrompt(prompt) {
  const normalized = String(prompt || "").trim();
  const lower = normalized.toLowerCase();
  const appName = normalized ? titleFromPrompt(normalized) : "AI Generated App";

  const screens = [{ id: "home", title: "Home", components: ["hero", "button", "list"] }];
  if (lower.includes("login")) {
    screens.push({ id: "login", title: "Login", components: ["form", "button"] });
  }
  if (lower.includes("dashboard") || lower.includes("analytics")) {
    screens.push({ id: "dashboard", title: "Dashboard", components: ["stats", "list"] });
  }

  return {
    name: appName,
    prompt: normalized,
    theme: lower.includes("dark") ? "dark" : "light",
    primaryColor: lower.includes("green") ? "#16a34a" : "#ff5a1f",
    heroText: normalized || "Describe your app idea to generate a project.",
    buttonLabel: "Get Started",
    layout: lower.includes("grid") ? "grid" : "stack",
    screens,
    actions: ["createItem", "deleteItem"],
    model: lower.includes("database") ? "Record" : "Item",
  };
}

export function applyPromptUpdate(blueprint, updatePrompt) {
  const next = { ...blueprint };
  const lower = String(updatePrompt || "").toLowerCase();

  if (lower.includes("dark mode")) next.theme = "dark";
  if (lower.includes("light mode")) next.theme = "light";
  if (lower.includes("change color") || lower.includes("blue")) next.primaryColor = "#2563eb";
  if (lower.includes("login") && !next.screens.some((screen) => screen.id === "login")) {
    next.screens = [...next.screens, { id: "login", title: "Login", components: ["form", "button"] }];
  }
  if (lower.includes("database")) {
    next.model = "Record";
    next.actions = Array.from(new Set([...(next.actions || []), "createRecord", "deleteRecord"]));
  }

  return next;
}

export function validateProject(files) {
  const names = Object.keys(files || {});
  const lineCount = names.reduce((sum, name) => sum + String(files[name]).split("\n").length, 0);

  if (names.length > MAX_FILES) {
    return { valid: false, error: `File limit exceeded (${names.length}/${MAX_FILES}).` };
  }

  if (lineCount > MAX_LINES) {
    return { valid: false, error: `Line limit exceeded (${lineCount}/${MAX_LINES}).` };
  }

  return { valid: true, error: "" };
}

function titleFromPrompt(prompt) {
  const clean = prompt
    .replace(/^(build|create|make)\s+/i, "")
    .replace(/\.$/, "")
    .trim();

  return clean
    .split(/\s+/)
    .slice(0, 6)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
