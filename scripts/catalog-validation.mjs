const ALLOWED_RELEASE_STATUSES = new Set([null, "一般提供", "Beta", "Open beta"]);

export function validateCatalogData({ categories, services, updates }) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(value + "T00:00:00.000Z");
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  };
  const isOfficialUrl = (value) => {
    if (typeof value !== "string" || !value) return false;
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      return url.protocol === "https:" && (host === "cloudflare.com" || host.endsWith(".cloudflare.com"));
    } catch {
      return false;
    }
  };
  const uniqueValues = (items) => new Set(items).size === items.length;

  for (const [name, value] of [["categories", categories], ["services", services], ["updates", updates]]) {
    check(Array.isArray(value), `${name} must be an array`);
    if (Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        check(isRecord(item), `${name} entry ${index} must be an object`);
      }
    }
  }
  if (![categories, services, updates].every(Array.isArray)) return errors;
  if ([categories, services, updates].some((items) => items.some((item) => !isRecord(item)))) return errors;

  check(categories.length > 0, "categories must be a non-empty array");
  check(services.length > 0, "services must be a non-empty array");

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
  const serviceDocsUrls = new Set();
  const featuredOrders = [];
  for (const service of services) {
    check(typeof service.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.id), "Invalid service id: " + service.id);
    check(!serviceIds.has(service.id), "Duplicate service id: " + service.id);
    serviceIds.add(service.id);
    check(typeof service.name === "string" && service.name.trim().length > 0, "Missing name: " + service.id);
    const normalizedName = typeof service.name === "string" ? service.name.normalize("NFKC").toLocaleLowerCase("ja-JP") : "";
    check(!serviceNames.has(normalizedName), "Duplicate normalized service name: " + service.name);
    serviceNames.add(normalizedName);
    for (const field of ["summaryJa", "descriptionJa"]) {
      check(typeof service[field] === "string" && service[field].trim().length > 0, "Missing " + field + ": " + service.id);
    }
    check(categoryIds.has(service.category), "Unknown category on " + service.id + ": " + service.category);
    check(Array.isArray(service.tags) && service.tags.every((value) => typeof value === "string"), "Invalid tags: " + service.id);
    check(Array.isArray(service.useCases) && service.useCases.length > 0 && service.useCases.every((value) => typeof value === "string"), "Invalid useCases: " + service.id);
    const relatedServiceIds = Array.isArray(service.relatedServiceIds) ? service.relatedServiceIds : [];
    check(Array.isArray(service.relatedServiceIds), "relatedServiceIds must be an array: " + service.id);
    check(typeof service.iconLabel === "string" && service.iconLabel.length > 0, "Missing iconLabel: " + service.id);
    check(isOfficialUrl(service.docsUrl), "Invalid or non-Cloudflare docsUrl: " + service.id);
    if (isOfficialUrl(service.docsUrl)) {
      check(!serviceDocsUrls.has(service.docsUrl), "Duplicate service docsUrl: " + service.id);
      serviceDocsUrls.add(service.docsUrl);
    }
    check(service.productUrl === null || isOfficialUrl(service.productUrl), "Invalid productUrl: " + service.id);
    check(service.pricingUrl === null || isOfficialUrl(service.pricingUrl), "Invalid pricingUrl: " + service.id);
    check(Array.isArray(service.sourceUrls) && service.sourceUrls.length > 0 && service.sourceUrls.every(isOfficialUrl), "Invalid sourceUrls: " + service.id);
    if (Array.isArray(service.sourceUrls)) {
      check(uniqueValues(service.sourceUrls), "Duplicate sourceUrls: " + service.id);
      check(service.sourceUrls.includes(service.docsUrl), "docsUrl must also appear in sourceUrls: " + service.id);
      check(service.pricingUrl === null || service.sourceUrls.includes(service.pricingUrl), "pricingUrl must also appear in sourceUrls: " + service.id);
    }
    check(ALLOWED_RELEASE_STATUSES.has(service.releaseStatus), "Invalid releaseStatus: " + service.id);
    check(service.featuredOrder === null || (Number.isInteger(service.featuredOrder) && service.featuredOrder > 0), "Invalid featuredOrder: " + service.id);
    if (Number.isInteger(service.featuredOrder)) featuredOrders.push(service.featuredOrder);
    check(isDate(service.verifiedAt), "Invalid verifiedAt: " + service.id);
  }
  check(uniqueValues(featuredOrders), "featuredOrder values must be unique");

  for (const service of services) {
    const relatedServiceIds = Array.isArray(service.relatedServiceIds) ? service.relatedServiceIds : [];
    check(uniqueValues(relatedServiceIds), "Duplicate relatedServiceIds: " + service.id);
    for (const relatedId of relatedServiceIds) {
      check(serviceIds.has(relatedId), "Unknown related service id " + relatedId + " on " + service.id);
      check(relatedId !== service.id, "Service cannot relate to itself: " + service.id);
    }
  }

  const updateIds = new Set();
  const updateKeys = new Set();
  const updateSourceUrls = new Set();
  let previousPublishedAt = null;
  for (const update of updates) {
    check(typeof update.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(update.id), "Invalid update id: " + update.id);
    check(!updateIds.has(update.id), "Duplicate update id: " + update.id);
    updateIds.add(update.id);
    check(typeof update.titleJa === "string" && update.titleJa.trim().length > 0, "Missing update title: " + update.id);
    check(typeof update.summaryJa === "string" && update.summaryJa.trim().length > 0, "Missing update summary: " + update.id);
    check(["new-service", "service-update", "public-beta"].includes(update.type), "Invalid update type: " + update.id);
    const publishedAtIsValid = isDate(update.publishedAt);
    check(publishedAtIsValid, "Invalid publishedAt: " + update.id);
    if (publishedAtIsValid && previousPublishedAt !== null) {
      check(previousPublishedAt >= update.publishedAt, "Updates must be sorted by publishedAt descending: " + update.id);
    }
    if (publishedAtIsValid) previousPublishedAt = update.publishedAt;
    check(isDate(update.verifiedAt), "Invalid update verifiedAt: " + update.id);
    check(isDate(update.publishedAt) && isDate(update.verifiedAt) && update.publishedAt <= update.verifiedAt, "publishedAt is later than verifiedAt: " + update.id);
    check(Array.isArray(update.serviceIds) && update.serviceIds.length > 0, "Update must reference a service: " + update.id);
    const updateServiceIds = Array.isArray(update.serviceIds) ? update.serviceIds : [];
    check(uniqueValues(updateServiceIds), "Duplicate serviceIds on update: " + update.id);
    for (const serviceId of updateServiceIds) {
      check(serviceIds.has(serviceId), "Unknown service id " + serviceId + " on update " + update.id);
    }
    check(isOfficialUrl(update.sourceUrl), "Invalid or non-Cloudflare sourceUrl: " + update.id);
    if (isOfficialUrl(update.sourceUrl)) {
      check(!updateSourceUrls.has(update.sourceUrl), "Duplicate update source URL: " + update.id);
      updateSourceUrls.add(update.sourceUrl);
    }
    const updateKey = update.publishedAt + "|" + (typeof update.titleJa === "string" ? update.titleJa.normalize("NFKC").toLocaleLowerCase("ja-JP") : "");
    check(!updateKeys.has(updateKey), "Duplicate update date and title: " + update.id);
    updateKeys.add(updateKey);
  }

  return errors;
}
