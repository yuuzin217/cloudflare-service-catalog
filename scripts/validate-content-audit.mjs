import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Coverage / traceability test only: passing does not certify copyright clearance.
const loadJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const services = await loadJson("../data/services.json");
const updates = await loadJson("../data/updates.json");
const ledger = await readFile(new URL("../docs/CONTENT_AUDIT_2026-10-30.md", import.meta.url), "utf8");
const allowedStatuses = new Set(["詳細対照", "一次確認", "要原典再確認"]);
const records = new Map();

for (const line of ledger.split(/\r?\n/)) {
  const match = line.match(/^\| (service|update) \| \x60([^\x60]+)\x60 \| (https:\/\/[^ |\t]+) \| ([^ |]+) \| (.+) \|$/);
  if (!match) continue;
  const [, kind, id, url, status, reason] = match;
  assert.ok(allowedStatuses.has(status), "unknown status for " + kind + "/" + id + ": " + status);
  assert.ok(reason.trim().length >= 12, "missing audit reason for " + kind + "/" + id);
  const key = kind + "/" + id;
  assert.ok(!records.has(key), "duplicate audit record: " + key);
  records.set(key, { url, status });
}
const expected = new Map();
for (const item of services) expected.set("service/" + item.id, item.docsUrl);
for (const item of updates) expected.set("update/" + item.id, item.sourceUrl);
assert.equal(records.size, expected.size, "audit ledger must cover every catalog entry");
for (const [key, url] of expected) {
  const entry = records.get(key);
  assert.ok(entry, "missing audit record: " + key);
  assert.equal(entry.url, url, "source URL changed: re-review and refresh " + key);
}
for (const key of records.keys()) assert.ok(expected.has(key), "stale audit record: " + key);
const count = (status) => [...records.values()].filter(x => x.status === status).length;
console.log("Content audit coverage PASS: " + services.length + " services + " + updates.length
  + " updates; detailed=" + count("詳細対照") + ", preliminary=" + count("一次確認")
  + ", missing-source=" + count("要原典再確認"));
