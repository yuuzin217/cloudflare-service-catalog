import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const appJs = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");

function section(startName, endName) {
  const start = appJs.indexOf("  function " + startName + "(");
  const end = appJs.indexOf("  function " + endName + "(", start + 1);
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

console.log("OK: phase 1 UI hooks, multi-term search, category filtering and theme fallback.");
