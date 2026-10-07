import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/server.js";

test("incident API omits answers and validates submissions", async () => {
  const server = app.listen(0);
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const items = await (await fetch(base + "/api/incidents")).json();
    assert.equal(items.length, 8);
    assert.ok(
      items.every(
        (i: any) =>
          !("answer" in i) && !("remediation" in i) && !("verification" in i),
      ),
    );
    for (const body of [
      { diagnosis: "index", remediation: 5, verification: "" },
      { diagnosis: "unknown" },
      { diagnosis: "index", remediation: "x".repeat(4001) },
    ]) {
      assert.equal(
        (
          await fetch(base + "/api/incidents/db-latency/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        ).status,
        422,
      );
    }
    assert.equal(
      (
        await fetch(base + "/api/incidents/unknown/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      ).status,
      404,
    );
  } finally {
    server.close();
  }
});
