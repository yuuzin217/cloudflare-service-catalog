import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const services = JSON.parse(await readFile(new URL("../data/services.json", import.meta.url), "utf8"));
const updates = JSON.parse(await readFile(new URL("../data/updates.json", import.meta.url), "utf8"));
const indexHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const appJs = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const byId = new Map(services.map((service) => [service.id, service]));

const verifiedPricing = {
  workers: "https://developers.cloudflare.com/workers/platform/pricing/",
  d1: "https://developers.cloudflare.com/d1/platform/pricing/",
  r2: "https://developers.cloudflare.com/r2/pricing/",
  "durable-objects": "https://developers.cloudflare.com/durable-objects/platform/pricing/",
  "workers-for-platforms": "https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/pricing/",
  "workers-kv": "https://developers.cloudflare.com/kv/platform/pricing/",
  queues: "https://developers.cloudflare.com/queues/platform/pricing/",
  pipelines: "https://developers.cloudflare.com/basin-pipelines/platform/pricing/",
  basin: "https://developers.cloudflare.com/basin/platform/pricing/",
  "workers-ai": "https://developers.cloudflare.com/workers-ai/platform/pricing/",
  "ai-gateway": "https://developers.cloudflare.com/ai-gateway/reference/pricing/",
  images: "https://developers.cloudflare.com/images/pricing/",
  stream: "https://developers.cloudflare.com/stream/pricing/"
};
for (const [id, url] of Object.entries(verifiedPricing)) {
  assert.equal(byId.get(id)?.pricingUrl, url, `${id} has the reviewed official pricing URL`);
  assert.ok(byId.get(id).sourceUrls.includes(url), `${id} lists its pricing URL as a source`);
}
assert.equal(byId.get("pages")?.pricingUrl, null, "Pages keeps pricing unset without a general pricing page");

const pipelines = byId.get("pipelines");
const basin = byId.get("basin");
assert.equal(pipelines.name, "Basin Pipelines");
assert.equal(pipelines.docsUrl, "https://developers.cloudflare.com/basin-pipelines/");
assert.ok(pipelines.sourceUrls.includes("https://developers.cloudflare.com/basin/"));
assert.ok(pipelines.descriptionJa.includes("親プラットフォームとは区別"));
assert.ok(pipelines.relatedServiceIds.includes("basin"));
assert.ok(basin.relatedServiceIds.includes("pipelines"));
assert.ok(basin.descriptionJa.includes("プラットフォーム全体"));
assert.equal(byId.get("pipelines").id, "pipelines", "Pipelines stable ID is retained");
const cws = byId.get("cloud-workload-security");
assert.equal(cws?.category, "security");
assert.equal(cws?.releaseStatus, "Beta");
assert.equal(cws?.pricingUrl, null, "CWS pricing remains unset without a verified pricing page");
assert.equal(services.filter((service) => service.name.normalize("NFKC").toLocaleLowerCase("ja-JP") === "cloud workload security").length, 1, "new service is not duplicated");

assert.match(indexHtml, /<dialog[^>]*aria-labelledby="detailTitle"/);
assert.match(appJs, /title\.id\s*=\s*"detailTitle"/);
assert.match(appJs, /title\.focus\(\)/);
assert.deepEqual(updates.map((update) => update.publishedAt), updates.map((update) => update.publishedAt).slice().sort().reverse(), "updates are newest-first by publishedAt");
assert.equal(updates[0].publishedAt, "2026-10-20", "the newest reviewed entries use their article publication date");
const cwsUpdate = updates.find((update) => update.id === "cloud-workload-security-beta-20261019");
assert.equal(cwsUpdate?.type, "new-service");
assert.deepEqual(cwsUpdate?.serviceIds, ["cloud-workload-security"]);
assert.equal(cwsUpdate?.publishedAt, "2026-10-19");
for (const id of [
  "warp-windows-client-2026-10-20",
  "warp-macos-client-2026-10-20",
  "warp-linux-client-2026-10-20",
  "agents-mcp-step-up-2026-10-19",
  "bots-precursor-monitor-mode-2026-10-19",
  "cloud-workload-security-beta-20261019",
  "workers-ai-clairic-preview-2026-10-19",
  "workers-ai-deepseek-v41-flash-2026-10-19",
  "workers-cron-local-explorer-2026-10-17",
  "ai-search-cjk-keyword-search-2026-10-16",
  "tunnels-platforms-50000-routes-2026-10-16"
]) {
  assert.ok(updates.some((update) => update.id === id), `reviewed Changelog article ${id} is listed`);
}
console.log(`OK: reviewed pricing links, Basin relationships, detail naming/focus, and ${updates.length} Changelog entries.`);
