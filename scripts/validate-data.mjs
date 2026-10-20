import { readFile } from "node:fs/promises";

const categories = await readJson("../data/categories.json");
const services = await readJson("../data/services.json");
const updates = await readJson("../data/updates.json");
const errors = [];

async function readJson(path) {
  const file = new URL(path, import.meta.url);
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    console.error("Could not read " + file.pathname + ": " + error.message);
    process.exit(1);
  }
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isOfficialUrl(value) {
  if (typeof value !== "string" || !value) return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "cloudflare.com" || host.endsWith(".cloudflare.com"));
  } catch (error) {
    return false;
  }
}

function uniqueValues(items) {
  return new Set(items).size === items.length;
}

check(Array.isArray(categories) && categories.length > 0, "categories.json must be a non-empty array");
check(Array.isArray(services) && services.length > 0, "services.json must be a non-empty array");
check(Array.isArray(updates), "updates.json must be an array");

const categoryIds = new Set();
const categoryOrders = [];
for (const category of categories) {
  check(typeof category.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.id), "Invalid category id: " + category.id);
  check(typeof category.name === "string" && category.name.length > 0, "Missing category name: " + category.id);
  check(typeof category.summaryJa === "string" && category.summaryJa.length > 0, "Missing category summary: " + category.id);
  check(typeof category.icon === "string" && category.icon.length > 0, "Missing category icon: " + category.id);
  check(Number.isInteger(category.order) && category.order > 0, "Invalid category order: " + category.id);
  check(!categoryIds.has(category.id), "Duplicate category id: " + category.id);
  categoryIds.add(category.id);
  categoryOrders.push(category.order);
}
check(uniqueValues(categoryOrders), "Category order values must be unique");

const serviceIds = new Set();
const serviceNames = new Set();
const featuredOrders = [];
for (const service of services) {
  check(typeof service.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.id), "Invalid service id: " + service.id);
  check(!serviceIds.has(service.id), "Duplicate service id: " + service.id);
  serviceIds.add(service.id);
  check(typeof service.name === "string" && service.name.trim().length > 0, "Missing name: " + service.id);
  const normalizedName = service.name.normalize("NFKC").toLocaleLowerCase("ja-JP");
  check(!serviceNames.has(normalizedName), "Duplicate normalized service name: " + service.name);
  serviceNames.add(normalizedName);
  for (const field of ["summaryJa", "descriptionJa"]) {
    check(typeof service[field] === "string" && service[field].trim().length > 0, "Missing " + field + ": " + service.id);
  }
  check(categoryIds.has(service.category), "Unknown category on " + service.id + ": " + service.category);
  check(Array.isArray(service.tags) && service.tags.every((value) => typeof value === "string"), "Invalid tags: " + service.id);
  check(Array.isArray(service.useCases) && service.useCases.length > 0 && service.useCases.every((value) => typeof value === "string"), "Invalid useCases: " + service.id);
  check(Array.isArray(service.relatedServiceIds), "relatedServiceIds must be an array: " + service.id);
  check(typeof service.iconLabel === "string" && service.iconLabel.length > 0, "Missing iconLabel: " + service.id);
  check(isOfficialUrl(service.docsUrl), "Invalid or non-Cloudflare docsUrl: " + service.id);
  check(service.productUrl === null || isOfficialUrl(service.productUrl), "Invalid productUrl: " + service.id);
  check(service.pricingUrl === null || isOfficialUrl(service.pricingUrl), "Invalid pricingUrl: " + service.id);
  check(Array.isArray(service.sourceUrls) && service.sourceUrls.length > 0 && service.sourceUrls.every(isOfficialUrl), "Invalid sourceUrls: " + service.id);
  check(service.sourceUrls.includes(service.docsUrl), "docsUrl must also appear in sourceUrls: " + service.id);
  check(service.releaseStatus === null || (typeof service.releaseStatus === "string" && service.releaseStatus.length > 0), "Invalid releaseStatus: " + service.id);
  check(service.featuredOrder === null || (Number.isInteger(service.featuredOrder) && service.featuredOrder > 0), "Invalid featuredOrder: " + service.id);
  if (Number.isInteger(service.featuredOrder)) featuredOrders.push(service.featuredOrder);
  check(isDate(service.verifiedAt), "Invalid verifiedAt: " + service.id);
}
check(uniqueValues(featuredOrders), "featuredOrder values must be unique");

for (const service of services) {
  check(uniqueValues(service.relatedServiceIds), "Duplicate relatedServiceIds: " + service.id);
  for (const relatedId of service.relatedServiceIds) {
    check(serviceIds.has(relatedId), "Unknown related service id " + relatedId + " on " + service.id);
    check(relatedId !== service.id, "Service cannot relate to itself: " + service.id);
  }
}

const updateIds = new Set();
const updateKeys = new Set();
for (const update of updates) {
  check(typeof update.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(update.id), "Invalid update id: " + update.id);
  check(!updateIds.has(update.id), "Duplicate update id: " + update.id);
  updateIds.add(update.id);
  check(typeof update.titleJa === "string" && update.titleJa.trim().length > 0, "Missing update title: " + update.id);
  check(typeof update.summaryJa === "string" && update.summaryJa.trim().length > 0, "Missing update summary: " + update.id);
  check(["new-service", "service-update", "public-beta"].includes(update.type), "Invalid update type: " + update.id);
  check(isDate(update.publishedAt), "Invalid publishedAt: " + update.id);
  check(isDate(update.verifiedAt), "Invalid update verifiedAt: " + update.id);
  check(update.publishedAt <= update.verifiedAt, "publishedAt is later than verifiedAt: " + update.id);
  check(Array.isArray(update.serviceIds) && update.serviceIds.length > 0, "Update must reference a service: " + update.id);
  check(uniqueValues(update.serviceIds), "Duplicate serviceIds on update: " + update.id);
  for (const serviceId of update.serviceIds || []) {
    check(serviceIds.has(serviceId), "Unknown service id " + serviceId + " on update " + update.id);
  }
  check(isOfficialUrl(update.sourceUrl), "Invalid or non-Cloudflare sourceUrl: " + update.id);
  const updateKey = update.publishedAt + "|" + update.titleJa.normalize("NFKC").toLocaleLowerCase("ja-JP");
  check(!updateKeys.has(updateKey), "Duplicate update date and title: " + update.id);
  updateKeys.add(updateKey);
}

if (errors.length) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error("- " + error));
  process.exit(1);
}

const byCategory = new Map();
for (const service of services) {
  byCategory.set(service.category, (byCategory.get(service.category) || 0) + 1);
}
console.log("OK: " + services.length + " services, " + categories.length + " categories, " + updates.length + " updates.");
for (const category of categories.slice().sort((a, b) => a.order - b.order)) {
  console.log("  " + category.name + ": " + (byCategory.get(category.id) || 0));
}
