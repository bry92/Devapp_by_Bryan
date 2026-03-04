import test from "node:test";
import assert from "node:assert/strict";
import { applyPromptUpdate, createBlueprintFromPrompt, validateProject } from "../src/engine/aiBuilder.js";
import { generateProjectFiles } from "../src/engine/projectGenerator.mjs";

test("createBlueprintFromPrompt creates base blueprint", () => {
  const blueprint = createBlueprintFromPrompt("Build a task manager with dark mode");
  assert.equal(blueprint.theme, "dark");
  assert.ok(Array.isArray(blueprint.screens));
  assert.ok(blueprint.screens.length >= 1);
});

test("applyPromptUpdate adds login screen and database model", () => {
  const blueprint = createBlueprintFromPrompt("Build a landing page");
  const updated = applyPromptUpdate(blueprint, "Add login page and a database");
  assert.ok(updated.screens.some((screen) => screen.id === "login"));
  assert.equal(updated.model, "Record");
});

test("generated project respects validation limits", () => {
  const files = generateProjectFiles(createBlueprintFromPrompt("Build a dog grooming landing page"));
  const result = validateProject(files);
  assert.equal(result.valid, true);
});
