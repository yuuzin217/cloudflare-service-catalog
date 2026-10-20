"use strict";

(function () {
  const CATEGORY_ICONS = {
    compute: [
      ["path", { d: "M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" }],
      ["path", { d: "m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" }]
    ],
    storage: [
      ["ellipse", { cx: "12", cy: "5", rx: "8", ry: "3" }],
      ["path", { d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" }]
    ],
    ai: [
      ["path", { d: "m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" }],
      ["path", { d: "m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" }]
    ],
    security: [
      ["path", { d: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" }],
      ["path", { d: "m9 12 2 2 4-4" }]
    ],
    network: [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["path", { d: "M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" }]
    ],
    media: [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["path", { d: "m10 8 6 4-6 4V8Z" }]
    ],
    "zero-trust": [
      ["circle", { cx: "9", cy: "8", r: "3" }],
      ["path", { d: "M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" }]
    ]
  };

  const elements = {
    search: document.getElementById("searchInput"),
    clearSearch: document.getElementById("clearSearch"),
    categoryGrid: document.getElementById("categoryGrid"),
    serviceGrid: document.getElementById("serviceGrid"),
    resultCount: document.getElementById("resultCount"),
    emptyState: document.getElementById("emptyState"),
    loadError: document.getElementById("loadError"),
    sort: document.getElementById("sortSelect"),
    gridView: document.getElementById("gridView"),
    listView: document.getElementById("listView"),
    activeFilterRow: document.getElementById("activeFilterRow"),
    activeFilterText: document.getElementById("activeFilterText"),
    sidebarUpdates: document.getElementById("sidebarUpdates"),
    featuredList: document.getElementById("featuredList"),
    updatesList: document.getElementById("updatesList"),
    updatesEmpty: document.getElementById("updatesEmpty"),
    latestPreview: document.getElementById("latestPreview"),
    latestPreviewDate: document.getElementById("latestPreviewDate"),
    latestPreviewTitle: document.getElementById("latestPreviewTitle"),
    dialog: document.getElementById("serviceDialog"),
    dialogContent: document.getElementById("dialogContent"),
    lastVerifiedDate: document.getElementById("lastVerifiedDate"),
    menuToggle: document.getElementById("menuToggle"),
    primaryNav: document.getElementById("primaryNav")
  };

  let categories = [];
  let services = [];
  let updates = [];
  let selectedCategory = "";
  let searchTerm = "";
  let sortMode = "name";
  let viewMode = "grid";

  function makeElement(tagName, className, content) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (content !== undefined && content !== null) element.textContent = String(content);
    return element;
  }

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
  }

  function officialUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      const isCloudflare = host === "cloudflare.com" || host.endsWith(".cloudflare.com");
      return url.protocol === "https:" && isCloudflare ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function makeExternalLink(urlValue, label, className) {
    const url = officialUrl(urlValue);
    if (!url) return null;
    const link = makeElement("a", className, label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function getCategory(categoryId) {
    return categories.find(function (category) {
      return category.id === categoryId;
    });
  }

  function getCategoryName(categoryId) {
    const category = getCategory(categoryId);
    return category ? category.name : categoryId;
  }

  function getService(serviceId) {
    return services.find(function (service) {
      return service.id === serviceId;
    });
  }

  function createCategoryIcon(iconName) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const shapes = CATEGORY_ICONS[iconName] || CATEGORY_ICONS.compute;
    shapes.forEach(function (shape) {
      const node = document.createElementNS("http://www.w3.org/2000/svg", shape[0]);
      Object.keys(shape[1]).forEach(function (attribute) {
        node.setAttribute(attribute, shape[1][attribute]);
      });
      svg.appendChild(node);
    });
    return svg;
  }

  function createServiceMark(service, isSmall) {
    const mark = makeElement("span", "service-mark" + (isSmall ? " service-mark-small" : ""), service.iconLabel || service.name.slice(0, 2));
    mark.setAttribute("aria-hidden", "true");
    mark.dataset.category = service.category;
    return mark;
  }

  function formatDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
    return value;
  }

  function updateTypeLabel(type) {
    if (type === "new-service") return "新サービス";
    if (type === "public-beta") return "パブリックベータ";
    return "サービス更新";
  }

  function orderedUpdates() {
    return updates.slice().sort(function (a, b) {
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }

  function buildCategoryGrid() {
    const counts = new Map();
    services.forEach(function (service) {
      counts.set(service.category, (counts.get(service.category) || 0) + 1);
    });

    elements.categoryGrid.replaceChildren();
    categories.slice().sort(function (a, b) {
      return a.order - b.order;
    }).forEach(function (category) {
      const button = makeElement("button", "category-card");
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", selectedCategory === category.id ? "true" : "false");

      const icon = makeElement("span", "category-icon");
      icon.appendChild(createCategoryIcon(category.icon));
      button.appendChild(icon);

      const nameRow = makeElement("span", "category-name");
      nameRow.appendChild(makeElement("span", "", category.name));
      nameRow.appendChild(makeElement("span", "category-count", String(counts.get(category.id) || 0)));
      button.appendChild(nameRow);
      button.appendChild(makeElement("span", "category-description", category.summaryJa));
      button.appendChild(makeElement("span", "category-chevron", "›"));
      if (selectedCategory === category.id) button.classList.add("is-active");

      button.addEventListener("click", function () {
        selectedCategory = selectedCategory === category.id ? "" : category.id;
        updateFilterState();
        renderServices();
      });
      elements.categoryGrid.appendChild(button);
    });
  }

  function searchableText(service) {
    return [
      service.name,
      service.summaryJa,
      service.descriptionJa,
      getCategoryName(service.category),
      (service.tags || []).join(" "),
      (service.useCases || []).join(" ")
    ].join(" ");
  }

  function compareServices(a, b) {
    if (sortMode === "featured") {
      const aOrder = Number.isInteger(a.featuredOrder) ? a.featuredOrder : Number.MAX_SAFE_INTEGER;
      const bOrder = Number.isInteger(b.featuredOrder) ? b.featuredOrder : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
    } else if (sortMode === "category") {
      const aCategory = getCategory(a.category);
      const bCategory = getCategory(b.category);
      const aOrder = aCategory ? aCategory.order : Number.MAX_SAFE_INTEGER;
      const bOrder = bCategory ? bCategory.order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
    }
    return a.name.localeCompare(b.name, "ja");
  }

  function createServiceCard(service) {
    const card = makeElement("article", "service-card");
    card.dataset.serviceId = service.id;

    const top = makeElement("div", "service-card-top");
    top.appendChild(createServiceMark(service, false));
    const heading = makeElement("div", "service-card-heading");
    heading.appendChild(makeElement("h3", "", service.name));
    const category = makeElement("span", "category-chip", getCategoryName(service.category));
    category.dataset.category = service.category;
    heading.appendChild(category);
    if (service.releaseStatus) {
      heading.appendChild(makeElement("span", "status-chip", service.releaseStatus));
    }
    top.appendChild(heading);
    card.appendChild(top);

    card.appendChild(makeElement("p", "service-summary", service.summaryJa));

    const tags = makeElement("div", "service-tags");
    (service.tags || []).slice(0, 3).forEach(function (tag) {
      tags.appendChild(makeElement("span", "service-tag", tag));
    });
    card.appendChild(tags);

    const footer = makeElement("div", "service-card-footer");
    const docsLink = makeExternalLink(service.docsUrl, "ドキュメント", "doc-link");
    if (docsLink) {
      docsLink.appendChild(makeElement("span", "link-external", "↗"));
      footer.appendChild(docsLink);
    }
    const details = makeElement("button", "detail-link", "詳細を見る");
    details.type = "button";
    details.dataset.openService = service.id;
    details.setAttribute("aria-label", service.name + "の詳細を見る");
    footer.appendChild(details);
    card.appendChild(footer);
    return card;
  }

  function updateFilterState() {
    const activeCategory = selectedCategory ? getCategoryName(selectedCategory) : "";
    const parts = [];
    if (searchTerm) parts.push("検索: " + searchTerm);
    if (activeCategory) parts.push("カテゴリ: " + activeCategory);
    elements.activeFilterRow.hidden = parts.length === 0;
    elements.activeFilterText.textContent = parts.join("　·　");
    document.querySelectorAll(".category-card").forEach(function (button) {
      const isActive = button.dataset.category === selectedCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    elements.clearSearch.hidden = searchTerm.length === 0;
  }

  function renderServices() {
    const query = normalize(searchTerm);
    const visible = services.filter(function (service) {
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      const matchesSearch = !query || normalize(searchableText(service)).includes(query);
      return matchesCategory && matchesSearch;
    }).sort(compareServices);

    elements.serviceGrid.replaceChildren();
    elements.serviceGrid.classList.toggle("is-list", viewMode === "list");
    visible.forEach(function (service) {
      elements.serviceGrid.appendChild(createServiceCard(service));
    });

    elements.resultCount.textContent = query || selectedCategory
      ? visible.length + "件が見つかりました"
      : "全" + services.length + "サービス";
    elements.serviceGrid.setAttribute("aria-busy", "false");
    elements.emptyState.hidden = visible.length > 0;
    elements.serviceGrid.hidden = visible.length === 0;
    updateFilterState();
  }

  function buildSidebarUpdates() {
    elements.sidebarUpdates.replaceChildren();
    orderedUpdates().slice(0, 4).forEach(function (update) {
      const item = makeElement("li", "sidebar-update");
      const time = makeElement("time", "", formatDate(update.publishedAt));
      time.dateTime = update.publishedAt;
      item.appendChild(time);

      const link = makeElement("a", "", update.titleJa);
      link.href = "#update-" + update.id;
      item.appendChild(link);
      elements.sidebarUpdates.appendChild(item);
    });
  }

  function buildFeaturedList() {
    elements.featuredList.replaceChildren();
    services.filter(function (service) {
      return Number.isInteger(service.featuredOrder);
    }).sort(function (a, b) {
      return a.featuredOrder - b.featuredOrder;
    }).slice(0, 5).forEach(function (service) {
      const item = makeElement("li", "featured-item");
      item.appendChild(createServiceMark(service, true));
      const copy = makeElement("div", "featured-copy");
      const button = makeElement("button", "", service.name);
      button.type = "button";
      button.className = "featured-name-button";
      button.dataset.openService = service.id;
      button.setAttribute("aria-label", service.name + "の詳細を見る");
      const summary = makeElement("p", "", service.summaryJa);
      copy.appendChild(button);
      copy.appendChild(summary);
      item.appendChild(copy);
      elements.featuredList.appendChild(item);
    });
  }

  function buildUpdatesList() {
    const items = orderedUpdates();
    elements.updatesList.replaceChildren();
    elements.updatesEmpty.hidden = items.length > 0;
    items.forEach(function (update) {
      const article = makeElement("article", "update-item");
      article.id = "update-" + update.id;

      const dateColumn = makeElement("div", "update-date-column");
      const time = makeElement("time", "update-date", formatDate(update.publishedAt));
      time.dateTime = update.publishedAt;
      dateColumn.appendChild(time);
      dateColumn.appendChild(makeElement("span", "update-type", updateTypeLabel(update.type)));
      article.appendChild(dateColumn);

      const body = makeElement("div", "update-body");
      body.appendChild(makeElement("h3", "", update.titleJa));
      body.appendChild(makeElement("p", "", update.summaryJa));

      const serviceLinks = makeElement("div", "update-service-links");
      (update.serviceIds || []).forEach(function (serviceId) {
        const service = getService(serviceId);
        if (!service) return;
        const button = makeElement("button", "", service.name);
        button.type = "button";
        button.dataset.openService = service.id;
        serviceLinks.appendChild(button);
      });
      if (serviceLinks.childElementCount) body.appendChild(serviceLinks);

      const source = makeExternalLink(update.sourceUrl, "公式Changelog ↗", "update-source");
      if (source) body.appendChild(source);
      article.appendChild(body);
      elements.updatesList.appendChild(article);
    });
  }

  function buildLatestPreview() {
    const first = orderedUpdates()[0];
    if (!first) {
      elements.latestPreview.hidden = true;
      return;
    }
    elements.latestPreview.href = "#update-" + first.id;
    elements.latestPreviewDate.textContent = formatDate(first.publishedAt);
    elements.latestPreviewTitle.textContent = first.titleJa;
    elements.latestPreview.setAttribute("aria-label", "最新情報: " + first.titleJa);
  }

  function buildLastVerifiedDate() {
    const dates = services.map(function (service) {
      return service.verifiedAt;
    }).concat(updates.map(function (update) {
      return update.verifiedAt;
    })).filter(Boolean).sort();
    const latest = dates.length ? dates[dates.length - 1] : "";
    elements.lastVerifiedDate.textContent = formatDate(latest) || "—";
    if (latest) elements.lastVerifiedDate.dateTime = latest;
  }

  function openServiceDetails(serviceId) {
    const service = getService(serviceId);
    if (!service) return;
    elements.dialogContent.replaceChildren();

    const header = makeElement("div", "detail-header");
    header.appendChild(createServiceMark(service, false));
    const heading = makeElement("div", "");
    heading.appendChild(makeElement("h2", "", service.name));
    heading.appendChild(makeElement("p", "", getCategoryName(service.category)));
    if (service.releaseStatus) heading.appendChild(makeElement("span", "status-chip", service.releaseStatus));
    header.appendChild(heading);
    elements.dialogContent.appendChild(header);

    const overview = makeElement("section", "detail-section");
    overview.appendChild(makeElement("h3", "", "概要"));
    overview.appendChild(makeElement("p", "", service.descriptionJa || service.summaryJa));
    elements.dialogContent.appendChild(overview);

    if (service.useCases && service.useCases.length) {
      const useCases = makeElement("section", "detail-section");
      useCases.appendChild(makeElement("h3", "", "できること・主な用途"));
      const list = makeElement("ul", "detail-list");
      service.useCases.forEach(function (useCase) {
        list.appendChild(makeElement("li", "", useCase));
      });
      useCases.appendChild(list);
      elements.dialogContent.appendChild(useCases);
    }

    if (service.tags && service.tags.length) {
      const tags = makeElement("section", "detail-section");
      tags.appendChild(makeElement("h3", "", "関連タグ"));
      const list = makeElement("ul", "detail-list");
      service.tags.forEach(function (tag) {
        list.appendChild(makeElement("li", "", tag));
      });
      tags.appendChild(list);
      elements.dialogContent.appendChild(tags);
    }

    const related = (service.relatedServiceIds || []).map(getService).filter(Boolean);
    if (related.length) {
      const relatedSection = makeElement("section", "detail-section");
      relatedSection.appendChild(makeElement("h3", "", "関連サービス"));
      const links = makeElement("div", "related-links");
      related.forEach(function (item) {
        const button = makeElement("button", "", item.name);
        button.type = "button";
        button.dataset.openService = item.id;
        links.appendChild(button);
      });
      relatedSection.appendChild(links);
      elements.dialogContent.appendChild(relatedSection);
    }

    const linkRow = makeElement("div", "detail-links");
    const docs = makeExternalLink(service.docsUrl, "公式ドキュメント ↗", "button button-primary");
    const product = makeExternalLink(service.productUrl, "公式製品ページ ↗", "button button-outline");
    const pricing = makeExternalLink(service.pricingUrl, "公式料金ページ ↗", "button button-outline");
    if (docs) linkRow.appendChild(docs);
    if (product) linkRow.appendChild(product);
    if (pricing) linkRow.appendChild(pricing);
    if (linkRow.childElementCount) elements.dialogContent.appendChild(linkRow);

    const checked = makeElement("p", "detail-footer", "情報確認日：" + (formatDate(service.verifiedAt) || "未確認"));
    elements.dialogContent.appendChild(checked);

    if (!elements.dialog.open) elements.dialog.showModal();
    elements.dialog.scrollTop = 0;
  }

  function clearFilters() {
    searchTerm = "";
    selectedCategory = "";
    sortMode = "name";
    viewMode = "grid";
    elements.search.value = "";
    elements.sort.value = "name";
    elements.gridView.classList.add("is-active");
    elements.listView.classList.remove("is-active");
    elements.gridView.setAttribute("aria-pressed", "true");
    elements.listView.setAttribute("aria-pressed", "false");
    buildCategoryGrid();
    renderServices();
  }

  function bindEvents() {
    elements.search.addEventListener("input", function () {
      searchTerm = elements.search.value;
      renderServices();
    });

    elements.clearSearch.addEventListener("click", function () {
      elements.search.value = "";
      searchTerm = "";
      elements.search.focus();
      renderServices();
    });

    document.getElementById("keywordList").addEventListener("click", function (event) {
      const button = event.target.closest("button[data-query]");
      if (!button) return;
      elements.search.value = button.dataset.query;
      searchTerm = button.dataset.query;
      renderServices();
      elements.search.focus();
    });

    document.getElementById("showAllCategories").addEventListener("click", function () {
      selectedCategory = "";
      updateFilterState();
      renderServices();
    });

    document.getElementById("resetFilters").addEventListener("click", clearFilters);
    document.getElementById("clearFilters").addEventListener("click", clearFilters);

    elements.sort.addEventListener("change", function () {
      sortMode = elements.sort.value;
      renderServices();
    });

    elements.gridView.addEventListener("click", function () {
      viewMode = "grid";
      elements.gridView.classList.add("is-active");
      elements.listView.classList.remove("is-active");
      elements.gridView.setAttribute("aria-pressed", "true");
      elements.listView.setAttribute("aria-pressed", "false");
      renderServices();
    });

    elements.listView.addEventListener("click", function () {
      viewMode = "list";
      elements.listView.classList.add("is-active");
      elements.gridView.classList.remove("is-active");
      elements.listView.setAttribute("aria-pressed", "true");
      elements.gridView.setAttribute("aria-pressed", "false");
      renderServices();
    });

    document.addEventListener("click", function (event) {
      const detailButton = event.target.closest("button[data-open-service]");
      if (detailButton) openServiceDetails(detailButton.dataset.openService);

      const navLink = event.target.closest("#primaryNav a");
      if (navLink && elements.primaryNav.classList.contains("is-open")) {
        elements.primaryNav.classList.remove("is-open");
        elements.menuToggle.setAttribute("aria-expanded", "false");
        elements.menuToggle.setAttribute("aria-label", "メニューを開く");
      }
    });

    document.getElementById("dialogClose").addEventListener("click", function () {
      elements.dialog.close();
    });

    elements.dialog.addEventListener("click", function (event) {
      if (event.target === elements.dialog) elements.dialog.close();
    });

    elements.menuToggle.addEventListener("click", function () {
      const isOpen = elements.primaryNav.classList.toggle("is-open");
      elements.menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      elements.menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });
  }

  async function loadCatalog() {
    try {
      const responses = await Promise.all([
        fetch("./data/categories.json"),
        fetch("./data/services.json"),
        fetch("./data/updates.json")
      ]);
      if (responses.some(function (response) { return !response.ok; })) {
        throw new Error("catalog-data-unavailable");
      }
      const data = await Promise.all(responses.map(function (response) { return response.json(); }));
      categories = data[0];
      services = data[1];
      updates = data[2];

      buildCategoryGrid();
      buildSidebarUpdates();
      buildFeaturedList();
      buildUpdatesList();
      buildLatestPreview();
      buildLastVerifiedDate();
      renderServices();
      elements.loadError.hidden = true;
    } catch (error) {
      elements.resultCount.textContent = "データを読み込めません";
      elements.serviceGrid.setAttribute("aria-busy", "false");
      elements.serviceGrid.hidden = true;
      elements.loadError.hidden = false;
    }
  }

  bindEvents();
  loadCatalog();
})();
