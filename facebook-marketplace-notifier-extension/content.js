let scanTimer = null;

initialize();

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "scanNow") {
    queueScan(500);
  }
});

function initialize() {
  queueScan(3500);
  if (!scanTimer) {
    scanTimer = setInterval(() => {
      queueScan(0);
    }, 15000);
  }
}

function queueScan(delay) {
  window.setTimeout(() => {
    runScan().catch(() => {});
  }, delay);
}

async function runScan() {
  if (!location.href.includes("facebook.com/marketplace")) {
    return;
  }

  const listings = collectListings();
  if (!listings.length) {
    return;
  }

  chrome.runtime.sendMessage({
    type: "listingsSnapshot",
    listings
  });
}

function collectListings() {
  const anchors = Array.from(document.querySelectorAll('a[href*="/marketplace/item/"]'));
  const results = [];
  const keys = new Set();

  for (const anchor of anchors) {
    const href = anchor.getAttribute("href") || "";
    const itemIdMatch = href.match(/\/marketplace\/item\/(\d+)/);
    const key = itemIdMatch?.[1] || normalizeUrl(href);
    if (!key || keys.has(key)) {
      continue;
    }

    const container =
      anchor.closest('[role="article"]') ||
      anchor.closest('[data-pagelet]') ||
      anchor.parentElement;

    const textLines = extractTextLines(container);
    const price = findPrice(textLines);
    const title = findTitle(textLines, price);

    if (!title || !price) {
      continue;
    }

    keys.add(key);
    results.push({
      key,
      title,
      url: normalizeUrl(href),
      price
    });
  }

  return results;
}

function extractTextLines(container) {
  if (!container) {
    return [];
  }

  return String(container.innerText || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function findPrice(lines) {
  const pricePattern = /(?:[$€£]\s?\d[\d,.]*|\d[\d,.]*\s?(?:USD|EUR|GBP))/i;
  return lines.find((line) => pricePattern.test(line)) || "";
}

function findTitle(lines, price) {
  const ignoredWords = ["sponsored", "marketplace", "shipping", "ago"];
  return (
    lines.find((line) => {
      const normalized = line.toLowerCase();
      if (!line || line === price) {
        return false;
      }
      if (line.length < 3 || line.length > 120) {
        return false;
      }
      if (ignoredWords.some((word) => normalized.includes(word))) {
        return false;
      }
      return true;
    }) || ""
  );
}

function normalizeUrl(rawHref) {
  if (!rawHref) {
    return "";
  }

  try {
    const url = new URL(rawHref, location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}
