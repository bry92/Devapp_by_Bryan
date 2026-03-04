import test from "node:test";
import assert from "node:assert/strict";
import { BONUS_UPGRADE, ROADMAP_UPGRADES } from "../src/pages/roadmapUpgrades.js";

test("roadmap includes exactly 5 core upgrades", () => {
  assert.equal(ROADMAP_UPGRADES.length, 5);
});

test("roadmap upgrade ids are unique", () => {
  const ids = ROADMAP_UPGRADES.map((upgrade) => upgrade.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("bonus upgrade exists", () => {
  assert.ok(BONUS_UPGRADE.title.includes("Real-Time AI Coding"));
});
