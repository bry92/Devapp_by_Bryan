import test from "node:test";
import assert from "node:assert/strict";
import { readStoredProject } from "../src/engine/projectPersistence.js";

test("readStoredProject returns parsed object for valid json", () => {
  const result = readStoredProject('{"files":{"src/App.jsx":"export default function App(){}"}}');
  assert.equal(typeof result, "object");
  assert.ok(result.files);
});

test("readStoredProject returns null for invalid json", () => {
  const result = readStoredProject("not json");
  assert.equal(result, null);
});
