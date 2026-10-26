import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const appJs = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");

function section(startName, endName) {
  const start = appJs.indexOf("  function " + startName + "(");
  let end = appJs.indexOf("  function " + endName + "(", start + 1);
  if (end === -1) end = appJs.indexOf("  async function " + endName + "(", start + 1);
  assert.ok(start !== -1 && end > start, startName + " / " + endName + " source exists");
  return appJs.slice(start, end);
}

assert.match(html, /id="searchResultHint"/);
assert.match(html, /id="searchResultMessage"/);
assert.match(html, /id="jumpToResults"/);
assert.match(html, /id="servicesTitle" tabindex="-1"/);
assert.doesNotMatch(html, /id="sidebarUpdates"/, "hero changelog is not repeated in the sidebar");
assert.doesNotMatch(html, /id="serviceGrid" aria-live=/, "the result count alone announces filter changes");
assert.match(css, /\.search-result-hint \{/);
assert.match(css, /body\[data-theme="dark"\] \.category-card\.is-active/);
assert.match(appJs, /prefers-reduced-motion/);
assert.match(appJs, /scrollIntoView/);
assert.match(appJs, /elements\.jumpToResults\.addEventListener/);
assert.match(appJs, /applyTheme\(initialTheme\(\)\)/);

const sampleServices = [
  {
    id: "workers", name: "Workers", category: "compute",
    summaryJa: "サーバーレスでAPIを実行", descriptionJa: "APIを公開",
    tags: ["JavaScript"], useCases: ["APIの公開"]
  },
  {
    id: "r2", name: "R2", category: "storage",
    summaryJa: "オブジェクトストレージ", descriptionJa: "ファイルの保存",
    tags: ["ストレージ"], useCases: ["画像の保存"]
  },
  {
    id: "access", name: "Access", category: "zero-trust",
    summaryJa: "安全なアクセス制御", descriptionJa: "認証",
    tags: ["セキュリティ"], useCases: ["社内向けアプリの保護"]
  }
];

const grid = {
  items: [], hidden: false,
  replaceChildren() { this.items = []; },
  appendChild(item) { this.items.push(item); },
  classList: { toggle() {} },
  setAttribute() {}
};
const elements = {
  serviceGrid: grid,
  resultCount: { textContent: "" },
  searchResultHint: { hidden: true },
  searchResultMessage: { textContent: "" },
  emptyState: { hidden: true }
};
const context = {
  services: sampleServices, searchTerm: "", selectedCategory: "", viewMode: "grid",
  elements,
  getCategoryName(id) { return ({ compute: "Compute", storage: "Storage", "zero-trust": "Zero Trust" })[id] || ""; },
  compareServices(a, b) { return a.name.localeCompare(b.name); },
  createServiceCard(service) { return service.id; },
  updateFilterState() {}
};

runInNewContext([
  section("normalize", "officialUrl"),
  section("searchableText", "compareServices"),
  section("renderServices", "buildHeroUpdates")
].join("\n"), context);

function checkFilter(search, category, expectedIds) {
  context.searchTerm = search;
  context.selectedCategory = category;
  context.renderServices();
  assert.deepEqual([...grid.items].sort(), [...expectedIds].sort(), search + " / " + category);
  assert.equal(elements.resultCount.textContent, search.trim() || category
    ? expectedIds.length + "件が見つかりました"
    : "全3サービス");
  assert.equal(elements.emptyState.hidden, expectedIds.length > 0);
  assert.equal(grid.hidden, expectedIds.length === 0);
  assert.equal(elements.searchResultHint.hidden, !(search.trim() || category));
}

checkFilter("", "", ["workers", "r2", "access"]);
checkFilter("  ", "", ["workers", "r2", "access"]);
checkFilter("Workers API", "", ["workers"]);
checkFilter("サーバレス", "", ["workers"]);
checkFilter("サーバーレス", "compute", ["workers"]);
checkFilter("ゼロトラスト", "", ["access"]);
checkFilter("R2", "compute", []);
checkFilter("", "storage", ["r2"]);
assert.equal(elements.searchResultMessage.textContent, "Storageのサービス: 1件");

// Legacy product names remain searchable after display-name changes.
// Use the actual catalog records with the production normalize/searchableText/renderServices functions.
const catalogServices = JSON.parse(await readFile(new URL("../data/services.json", import.meta.url), "utf8"));
context.services = catalogServices.filter((service) => ["magic-wan", "magic-firewall"].includes(service.id));
assert.equal(context.services.length, 2, "both renamed services exist");
for (const [query, expectedId] of [
  ["Magic WAN", "magic-wan"],
  ["Cloudflare WAN", "magic-wan"],
  ["Magic Firewall", "magic-firewall"],
  ["Cloudflare Network Firewall", "magic-firewall"]
]) {
  context.searchTerm = query;
  context.selectedCategory = "";
  context.renderServices();
  assert.ok(grid.items.includes(expectedId), `${query} finds ${expectedId}: ${grid.items.join(", ")}`);
}


function themeHarness(saved, osDark, throwsOnStorage = false) {
  const attributes = {};
  const body = { dataset: {} };
  const context = {
    window: {
      localStorage: {
        getItem() {
          if (throwsOnStorage) throw new Error("storage disabled");
          return saved;
        }
      },
      matchMedia() { return { matches: osDark }; }
    },
    document: {
      body,
      querySelector() { return { setAttribute(name, value) { attributes[name] = value; } }; }
    },
    elements: {
      themeToggle: { setAttribute(name, value) { attributes[name] = value; } }
    }
  };
  runInNewContext(section("applyTheme", "bindEvents"), context);
  return { context, attributes, body };
}

let theme = themeHarness("dark", false);
assert.equal(theme.context.initialTheme(), "dark", "saved preference wins over OS");
theme.context.applyTheme("dark");
assert.equal(theme.body.dataset.theme, "dark");
assert.equal(theme.attributes["aria-pressed"], "true");
assert.equal(theme.attributes.content, "#111b2c");
assert.equal(themeHarness(null, true).context.initialTheme(), "dark", "initial theme honors OS");
assert.equal(themeHarness(null, false).context.initialTheme(), "light");
assert.equal(themeHarness(null, true, true).context.initialTheme(), "dark", "storage failure falls back to OS");


// Filter reset hides its originating button; verify focus is handed off.
let resetRenderCount = 0;
let resetFocusCount = 0;
const resetContext = {
  searchTerm: "no-results",
  selectedCategory: "compute",
  elements: { search: { value: "no-results" } },
  renderServices() { resetRenderCount++; },
  showSearchResults() { resetFocusCount++; }
};
runInNewContext(section("clearFilters", "showSearchResults"), resetContext);
resetContext.clearFilters();
assert.equal(resetContext.searchTerm, "");
assert.equal(resetContext.selectedCategory, "");
assert.equal(resetContext.elements.search.value, "");
assert.equal(resetRenderCount, 1);
assert.equal(resetFocusCount, 1, "filter reset moves focus to the results heading");

// Exercise the actual keydown handler rather than only matching its source.
let keydownHandler;
let resultsNavigationCount = 0;
const noopElement = { addEventListener() {} };
const searchField = {
  addEventListener(type, handler) {
    if (type === "keydown") keydownHandler = handler;
  }
};
const eventContext = {
  elements: new Proxy({}, { get(target, prop) { return prop === "search" ? searchField : noopElement; } }),
  document: {
    getElementById() { return noopElement; },
    addEventListener() {}
  },
  showSearchResults() { resultsNavigationCount++; },
  clearFilters() {}
};
runInNewContext(section("bindEvents", "loadCatalog"), eventContext);
eventContext.bindEvents();
assert.equal(typeof keydownHandler, "function");

function pressEnter({ isComposing = false, keyCode = 13, key = "Enter" } = {}) {
  let prevented = false;
  keydownHandler({ key, isComposing, keyCode, preventDefault() { prevented = true; } });
  return prevented;
}

assert.equal(pressEnter({ isComposing: true }), false, "IME candidate confirmation is untouched");
assert.equal(pressEnter({ keyCode: 229 }), false, "legacy IME keydown is untouched");
assert.equal(resultsNavigationCount, 0, "IME must not move focus to results");
assert.equal(pressEnter({ key: "a" }), false, "regular typing does not navigate");
assert.equal(pressEnter(), true, "ordinary Enter submits the search");
assert.equal(resultsNavigationCount, 1);

assert.match(css, /@media \(max-width: 820px\) \{\s*\.catalog-sidebar \{\s*grid-template-columns: minmax\(0, 1fr\)/);
assert.match(css, /@media \(max-width: 820px\)[\s\S]*?\.search-wrap input \{\s*font-size: 16px;/);

console.log("OK: phase 1 UI hooks, multi-term search, category filtering and theme fallback, IME, reset focus and tablet CSS.");
