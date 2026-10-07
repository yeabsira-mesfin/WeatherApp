import test from "node:test";
import assert from "node:assert/strict";
import { incidents } from "../src/incidents.js";
import { score } from "../src/scoring.js";
test("correct diagnosis receives majority credit", () => {
  const i = incidents[0];
  const result = score(i, i.answer, i.remediation, i.verification);
  assert.equal(result.score, 100);
  assert.equal(result.grade, "Excellent");
});
test("wrong diagnosis cannot pass", () => {
  const i = incidents[0];
  const result = score(i, "dns", "", "");
  assert.equal(result.score, 0);
});
test("single keyword does not earn remediation credit", () => {
  assert.equal(score(incidents[0], "index", "composite", "latency").score, 55);
});
test("every curated reference receives full credit", () => {
  for (const i of incidents)
    assert.equal(score(i, i.answer, i.remediation, i.verification).score, 100);
});
