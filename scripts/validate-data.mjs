import { readFile } from "node:fs/promises";
import { validateCatalogData } from "./catalog-validation.mjs";

async function readJson(path) {
  const file = new URL(path, import.meta.url);
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    console.error("Could not read " + file.pathname + ": " + error.message);
    process.exit(1);
  }
}

const categories = await readJson("../data/categories.json");
const services = await readJson("../data/services.json");
const updates = await readJson("../data/updates.json");
const errors = validateCatalogData({ categories, services, updates });

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
