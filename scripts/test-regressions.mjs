import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateCatalogData } from "./catalog-validation.mjs";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const categories = await readJson("../data/categories.json");
const services = await readJson("../data/services.json");
const updates = await readJson("../data/updates.json");
const indexHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const appJs = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const sourceData = { categories, services, updates };
const cloneData = () => JSON.parse(JSON.stringify(sourceData));
const byId = new Map(services.map((service) => [service.id, service]));

assert.deepEqual(validateCatalogData(sourceData), [], "current catalog satisfies the data rules");

// Preserve the reviewed pricing coverage without pinning mutable URL paths.
for (const id of ["workers", "d1", "r2"]) {
  const service = byId.get(id);
  assert.ok(service, `${id} remains in the catalog`);
  assert.ok(typeof service.pricingUrl === "string", `${id} has a pricing page`);
  assert.ok(service.sourceUrls.includes(service.pricingUrl), `${id} cites its pricing page`);
}

// Basin Pipelines keeps its stable ID and explicit relationship to Basin.
const pipelines = byId.get("pipelines");
const basin = byId.get("basin");
assert.ok(pipelines, "Basin Pipelines stable ID remains present");
assert.ok(basin, "Basin remains present");
assert.ok(pipelines.relatedServiceIds.includes("basin"), "Pipelines references Basin");
assert.ok(basin.relatedServiceIds.includes("pipelines"), "Basin references Pipelines");
assert.ok(byId.has("cloud-workload-security"), "Cloud Workload Security remains represented");

// Sandbox environment pricing coverage: a single Containers-only URL is not a complete Sandboxes price guide.
// The Sandboxes overview links to both official environment-specific pricing pages.
const sandboxes = byId.get("sandboxes");
assert.ok(sandboxes, "Sandboxes remains represented");
assert.equal(sandboxes.pricingUrl, null, "Sandboxes does not present Containers-only pricing as the sole price link");
for (const url of [
  "https://developers.cloudflare.com/containers/platform/pricing/",
  "https://developers.cloudflare.com/dynamic-workers/pricing/"
]) {
  assert.ok(sandboxes.sourceUrls.includes(url), `Sandbox pricing source recorded: ${url}`);
}
assert.match(sandboxes.descriptionJa, /料金体系.*異な/, "Sandbox description distinguishes pricing models");

// K2 is a time-limited retained log, not an indefinite archive.
const k2 = byId.get("k2");
assert.ok(k2, "K2 remains represented");
assert.match(k2.summaryJa, /保持期間/, "K2 summary clarifies bounded event retention");
assert.doesNotMatch(k2.summaryJa, /永続/, "K2 summary does not imply indefinite retention");
assert.match(k2.descriptionJa, /既定7日.*上限30日/, "K2 describes the documented retention limits");
assert.ok(k2.sourceUrls.includes("https://developers.cloudflare.com/k2/platform/limits/"), "K2 limits have an official source");


// The detail dialog keeps its accessible name and puts focus on the generated heading.
assert.match(indexHtml, /<dialog[^>]*aria-labelledby="detailTitle"/);
assert.match(appJs, /title\.id\s*=\s*"detailTitle"/);
assert.match(appJs, /title\.focus\(\)/);

function assertInvalid(label, mutate, expectedError) {
  const fixture = cloneData();
  mutate(fixture);
  const errors = validateCatalogData(fixture);
  assert.ok(errors.some((error) => error.includes(expectedError)), `${label} is rejected: ${errors.join("; ")}`);
}

// A newly published article can be added without changing a test snapshot.
const newestPublishedAt = updates.reduce((latest, update) => update.publishedAt > latest ? update.publishedAt : latest, "0000-00-00");
const nextPublishedDate = new Date(`${newestPublishedAt}T00:00:00.000Z`);
nextPublishedDate.setUTCDate(nextPublishedDate.getUTCDate() + 1);
const nextPublishedAt = nextPublishedDate.toISOString().slice(0, 10);
const withNewArticle = cloneData();
withNewArticle.updates.unshift({
  id: `regression-fixture-${nextPublishedAt}`,
  titleJa: "回帰テスト用の新しい更新",
  summaryJa: "公開日の降順と新規追加の検証用データです。",
  type: "service-update",
  publishedAt: nextPublishedAt,
  verifiedAt: nextPublishedAt,
  serviceIds: ["workers"],
  sourceUrl: `https://developers.cloudflare.com/changelog/regression-fixture-${nextPublishedAt}/`
});
assert.deepEqual(validateCatalogData(withNewArticle), [], "a new newest Changelog article is accepted");

// An official pricing URL may change or be added when its source is recorded.
// The regression-fixture paths check schema rules only; actual service URLs are verified from Cloudflare sources during data updates.
const withChangedPricing = cloneData();
const changedWorker = withChangedPricing.services.find((service) => service.id === "workers");
const changedWorkerPrice = "https://developers.cloudflare.com/regression-fixture/updated-pricing/";
changedWorker.sourceUrls = changedWorker.sourceUrls.filter((url) => url !== changedWorker.pricingUrl);
changedWorker.pricingUrl = changedWorkerPrice;
changedWorker.sourceUrls.push(changedWorkerPrice);
const pages = withChangedPricing.services.find((service) => service.id === "pages");
const pagesPrice = "https://developers.cloudflare.com/regression-fixture/pages-pricing/";
pages.pricingUrl = pagesPrice;
pages.sourceUrls.push(pagesPrice);
assert.deepEqual(validateCatalogData(withChangedPricing), [], "changed and newly confirmed pricing URLs are accepted when cited");

// A documented release-state change from Beta to GA remains valid.
const withGaStatus = cloneData();
withGaStatus.services.find((service) => service.id === "cloud-workload-security").releaseStatus = "一般提供";
assert.deepEqual(validateCatalogData(withGaStatus), [], "Beta to GA status changes use an allowed status");

assertInvalid("duplicate service IDs", (data) => {
  data.services[1].id = data.services[0].id;
}, "Duplicate service id");
assertInvalid("duplicate official service documentation URLs", (data) => {
  data.services[1].docsUrl = data.services[0].docsUrl;
}, "Duplicate service docsUrl");
assertInvalid("duplicate service source URLs", (data) => {
  data.services[0].sourceUrls.push(data.services[0].sourceUrls[0]);
}, "Duplicate sourceUrls");
assertInvalid("duplicate update IDs", (data) => {
  data.updates[1].id = data.updates[0].id;
}, "Duplicate update id");
assertInvalid("duplicate official Changelog URLs", (data) => {
  data.updates[1].sourceUrl = data.updates[0].sourceUrl;
}, "Duplicate update source URL");
assertInvalid("invalid update dates", (data) => {
  data.updates[0].publishedAt = "2026-02-30";
}, "Invalid publishedAt");
assertInvalid("out-of-order update dates", (data) => {
  [data.updates[0], data.updates[data.updates.length - 1]] = [data.updates[data.updates.length - 1], data.updates[0]];
}, "sorted by publishedAt descending");
assertInvalid("unknown related-service references", (data) => {
  data.services[0].relatedServiceIds = ["missing-service"];
}, "Unknown related service id");
assertInvalid("unknown category references", (data) => {
  data.services[0].category = "missing-category";
}, "Unknown category on");
assertInvalid("unknown update service references", (data) => {
  data.updates[0].serviceIds = ["missing-service"];
}, "Unknown service id");
assertInvalid("non-official pricing URLs", (data) => {
  data.services[0].pricingUrl = "https://example.com/pricing";
}, "Invalid pricingUrl");
assertInvalid("pricing URLs without provenance", (data) => {
  data.services[0].pricingUrl = "https://developers.cloudflare.com/regression-fixture/uncited-pricing/";
}, "pricingUrl must also appear in sourceUrls");
assertInvalid("non-official Changelog URLs", (data) => {
  data.updates[0].sourceUrl = "https://example.com/changelog/article";
}, "Invalid or non-Cloudflare sourceUrl");
assertInvalid("unsupported release statuses", (data) => {
  data.services[0].releaseStatus = "Coming soon";
}, "Invalid releaseStatus");

console.log(`OK: catalog invariants, mutable-data scenarios, invalid fixtures, accessibility hooks, ${updates.length} current updates.`);
