import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve, sep } from "node:path";
import { chromium } from "playwright";

// No production dependencies or public endpoints. Test a GitHub Pages-style
// repository subpath against the checked-out static files.
const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
// Preview the post-rename GitHub Pages subpath without changing the production repository.
const prefix = "/edge-service-catalog/";
const mime = {
  ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".html": "text/html"
};

const server = createServer(async (req, res) => {
  let requestPath;
  try {
    requestPath = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (!requestPath.startsWith(prefix)) {
    res.writeHead(404).end();
    return;
  }
  const relative = requestPath.slice(prefix.length) || "index.html";
  const file = resolve(root, relative);
  if (!file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const bytes = await readFile(file);
    const ext = file.slice(file.lastIndexOf("."));
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(bytes);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((fulfill) => server.listen(0, "127.0.0.1", fulfill));
const url = "http://127.0.0.1:" + server.address().port + prefix;
let browser;

try {
  // GitHub-hosted Ubuntu runners already ship Chrome; avoid a large browser download.
  browser = await chromium.launch(process.env.CI ? { channel: "chrome" } : {});
  await mkdir(join(root, "test-results"), { recursive: true });

  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 840 },
      reducedMotion: "reduce",
      colorScheme: "light"
    });
    try {
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on("request", (request) => {
        if (new URL(request.url()).origin !== new URL(url).origin) externalRequests.push(request.url());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: "networkidle" });
      assert.deepEqual(externalRequests, [], width + ": initial page load has no third-party requests");
      assert.equal(await page.locator("#legal").count(), 1, width + ": legal and privacy notice is present");
      await page.locator(".service-card").first().waitFor();

      const expected = await page.evaluate(async () => {
        const files = ["./data/categories.json", "./data/services.json"];
        const responses = await Promise.all(files.map((path) => fetch(path)));
        const [categories, services] = await Promise.all(responses.map((r) => r.json()));
        return { categories: categories.length, services: services.length };
      });
      assert.equal(await page.locator(".category-card").count(), expected.categories, width + ": categories loaded");
      assert.equal(await page.locator(".service-card").count(), expected.services, width + ": services loaded");
      assert.deepEqual(errors, [], width + ": no browser script errors");

      const sizes = await page.evaluate(() => {
        const input = document.querySelector("#searchInput");
        const body = document.documentElement;
        const sidebar = document.querySelector(".catalog-sidebar");
        const featured = sidebar.querySelector(".featured-block");
        return {
          overflow: body.scrollWidth - body.clientWidth,
          inputSize: parseFloat(getComputedStyle(input).fontSize),
          descriptionSize: parseFloat(getComputedStyle(document.querySelector(".category-description")).fontSize),
          sidebarWidth: sidebar.getBoundingClientRect().width,
          featuredWidth: featured.getBoundingClientRect().width,
          offenders: [...document.querySelectorAll("body *")]
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.right > body.clientWidth + 1;
            })
            .slice(0, 16)
            .map((el) => ({
              tag: el.tagName,
              className: String(el.className?.baseVal ?? el.className).slice(0, 90),
              right: Math.round(el.getBoundingClientRect().right),
              width: Math.round(el.getBoundingClientRect().width)
            }))
        };
      });
      // Preserve the Japanese hero title as one phrase at narrow viewport widths.
      const titlePhrase = await page.locator("#pageTitle span").evaluate((span) => {
        const rect = span.getBoundingClientRect();
        return {
          text: span.textContent,
          whiteSpace: getComputedStyle(span).whiteSpace,
          lineRects: span.getClientRects().length,
          left: rect.left,
          right: rect.right
        };
      });
      if (width <= 390) {
        const subtitleBreak = await page.locator(".hero-description br")
          .evaluate((br) => getComputedStyle(br).display);
        assert.notEqual(subtitleBreak, "none", width + ": subtitle preserves its phrase break");
        const closing = await page.locator(".hero-description .summary-closing")
          .evaluate((span) => {
            const rect = span.getBoundingClientRect();
            return {
              text: span.textContent,
              whiteSpace: getComputedStyle(span).whiteSpace,
              lines: span.getClientRects().length,
              right: rect.right
            };
          });
        assert.equal(closing.text, "わかりやすく解説します。", width + ": closing phrase text");
        assert.equal(closing.whiteSpace, "nowrap", width + ": closing phrase is nonbreaking");
        assert.equal(closing.lines, 1, width + ": closing phrase stays on one line");
        assert.ok(closing.right <= width + 1, width + ": closing phrase stays in viewport");
      }
      assert.equal(titlePhrase.text, "サービス図鑑", width + ": Japanese title phrase is intact");
      assert.equal(titlePhrase.whiteSpace, "nowrap", width + ": Japanese title is nonbreaking");
      assert.equal(titlePhrase.lineRects, 1, width + ": title phrase stays on one line");
      assert.ok(titlePhrase.left >= -1 && titlePhrase.right <= width + 1,
        width + ": Japanese title remains inside viewport (" + JSON.stringify(titlePhrase) + ")");

      await page.screenshot({ path: join(root, "test-results", "catalog-" + width + ".png") });
      assert.ok(sizes.overflow <= 1, width + ": no horizontal overflow (" + sizes.overflow +
        "px); offenders: " + JSON.stringify(sizes.offenders));
      if (width <= 768) {
        assert.ok(sizes.inputSize >= 16, width + ": 16px minimum search input to avoid iOS zoom");
        assert.ok(sizes.descriptionSize >= 12, width + ": readable category descriptions");
      }
      if (width === 768) {
        assert.ok(Math.abs(sizes.sidebarWidth - sizes.featuredWidth) <= 2,
          "768px: featured sidebar uses the whole available width");
      }

      if (width !== 390) continue;

      // A normal Enter jumps to results and places keyboard focus on its heading.
      const search = page.locator("#searchInput");
      await search.fill("Workers");
      assert.match(await page.locator("#searchResultMessage").innerText(), /[1-9]\d*件/);
      await search.press("Enter");
      assert.equal(await page.evaluate(() => document.activeElement?.id), "servicesTitle");

      // An IME conversion confirmation must not hijack the Enter key.
      await search.focus();
      const ime = await search.evaluate((input) => {
        const event = new KeyboardEvent("keydown", {
          key: "Enter", bubbles: true, cancelable: true, isComposing: true
        });
        input.dispatchEvent(event);
        return { prevented: event.defaultPrevented, focused: document.activeElement === input };
      });
      assert.equal(ime.prevented, false, "IME Enter is not canceled");
      assert.equal(ime.focused, true, "IME Enter keeps focus in the search input");

      // Categories combine with search, and can be toggled off again.
      await search.fill("");
      const compute = page.locator('.category-card[data-category="compute"]');
      await compute.click();
      assert.equal(await compute.getAttribute("aria-pressed"), "true");
      assert.equal(await page.evaluate(() => document.activeElement?.id), "servicesTitle");
      await compute.click();
      assert.equal(await compute.getAttribute("aria-pressed"), "false");

      // Clearing an empty result or the active filter bar restores focus to the heading.
      await search.fill("missing-service-unlikely-123456");
      assert.equal(await page.locator(".service-card").count(), 0);
      const emptyReset = page.locator("#clearFilters");
      await emptyReset.focus();
      await emptyReset.press("Enter");
      assert.equal(await page.evaluate(() => document.activeElement?.id), "servicesTitle");
      assert.equal(await page.locator(".service-card").count(), expected.services);
      await search.fill("Workers");
      const activeReset = page.locator("#resetFilters");
      await activeReset.focus();
      await activeReset.press("Enter");
      assert.equal(await page.evaluate(() => document.activeElement?.id), "servicesTitle");

      // Controls, detail dialog and refresh-persistent theme still work.
      await page.locator("#sortSelect").selectOption("name");
      await page.locator("#listView").click();
      assert.equal(await page.locator("#listView").getAttribute("aria-pressed"), "true");
      const openDetails = page.locator(".service-card .detail-link").first();
      await openDetails.click();
      assert.equal(await page.locator("#serviceDialog").evaluate((el) => el.open), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#serviceDialog").evaluate((el) => el.open), false);

      await page.locator("#themeToggle").click();
      assert.equal(await page.locator("body").getAttribute("data-theme"), "dark");
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await page.locator("body").getAttribute("data-theme"), "dark");
      assert.equal(await page.locator("#themeToggle").getAttribute("aria-pressed"), "true");
      assert.deepEqual(errors, [], "no page errors during user interactions");
    } finally {
      await context.close();
    }
  }

  // With no saved preference, the first load should follow the OS color scheme.
  const darkOS = await browser.newContext({ colorScheme: "dark" });
  try {
    const page = await darkOS.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    assert.equal(await page.locator("body").getAttribute("data-theme"), "dark");
  } finally {
    await darkOS.close();
  }

  console.log("OK: Chromium browser checks at 320/390/768/1280px; IME, focus, filters, dialog, themes, subpath.");
} finally {
  if (browser) await browser.close();
  await new Promise((fulfill) => server.close(fulfill));
}
