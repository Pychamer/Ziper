const TAB_CONFIGS_KEY = "tabConfigs";
const SEEN_LISTINGS_KEY = "seenListings";
const ALARM_PREFIX = "marketplace-refresh-";
const MIN_ALARM_PERIOD_MINUTES = 0.1;
const MAX_SEEN_LISTINGS_PER_TAB = 2000;

chrome.runtime.onInstalled.addListener(async () => {
  const { [TAB_CONFIGS_KEY]: tabConfigs } = await chrome.storage.local.get(TAB_CONFIGS_KEY);
  if (!tabConfigs) {
    await chrome.storage.local.set({ [TAB_CONFIGS_KEY]: {} });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "upsertConfig") {
    upsertConfig(message.config)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "disableConfig") {
    disableConfig(message.tabId)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "listingsSnapshot") {
    const tabId = sender?.tab?.id;
    if (!Number.isFinite(tabId)) {
      sendResponse({ ok: false, error: "Tab unavailable" });
      return false;
    }

    processListings(tabId, message.listings || [])
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "getConfig") {
    getConfigForTab(message.tabId)
      .then((config) => sendResponse({ ok: true, config }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(ALARM_PREFIX)) {
    return;
  }

  const tabId = Number(alarm.name.slice(ALARM_PREFIX.length));
  if (!Number.isFinite(tabId)) {
    return;
  }

  const config = await getConfigForTab(tabId);
  if (!config?.enabled) {
    await chrome.alarms.clear(alarm.name);
    return;
  }

  await forceNavigate(tabId, config.marketplaceUrl);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await disableConfig(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "complete") {
    return;
  }

  getConfigForTab(tabId)
    .then((config) => {
      if (!config?.enabled) {
        return;
      }

      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { type: "scanNow" }).catch(() => {});
      }, 3000);
    })
    .catch(() => {});
});

async function upsertConfig(config) {
  if (!config || !Number.isFinite(config.tabId)) {
    throw new Error("Invalid tab config");
  }

  const cleanConfig = {
    tabId: config.tabId,
    marketplaceUrl: String(config.marketplaceUrl || "").trim(),
    webhookUrl: String(config.webhookUrl || "").trim(),
    intervalSeconds: clampInterval(config.intervalSeconds),
    enabled: Boolean(config.enabled)
  };

  if (!cleanConfig.marketplaceUrl || !cleanConfig.webhookUrl) {
    throw new Error("Marketplace URL and webhook URL are required");
  }

  const tabConfigs = await getTabConfigs();
  tabConfigs[String(cleanConfig.tabId)] = cleanConfig;
  await chrome.storage.local.set({ [TAB_CONFIGS_KEY]: tabConfigs });

  if (cleanConfig.enabled) {
    await scheduleAlarm(cleanConfig.tabId, cleanConfig.intervalSeconds);
    await forceNavigate(cleanConfig.tabId, cleanConfig.marketplaceUrl);
  }
}

async function disableConfig(tabId) {
  if (!Number.isFinite(tabId)) {
    return;
  }

  const key = String(tabId);
  const tabConfigs = await getTabConfigs();
  delete tabConfigs[key];

  const seen = await getSeenListings();
  delete seen[key];

  await chrome.storage.local.set({
    [TAB_CONFIGS_KEY]: tabConfigs,
    [SEEN_LISTINGS_KEY]: seen
  });

  await chrome.alarms.clear(getAlarmName(tabId));
}

async function getConfigForTab(tabId) {
  const tabConfigs = await getTabConfigs();
  return tabConfigs[String(tabId)] || null;
}

async function getTabConfigs() {
  const { [TAB_CONFIGS_KEY]: tabConfigs } = await chrome.storage.local.get(TAB_CONFIGS_KEY);
  return tabConfigs || {};
}

async function getSeenListings() {
  const { [SEEN_LISTINGS_KEY]: seen } = await chrome.storage.local.get(SEEN_LISTINGS_KEY);
  return seen || {};
}

function getAlarmName(tabId) {
  return `${ALARM_PREFIX}${tabId}`;
}

async function scheduleAlarm(tabId, intervalSeconds) {
  const alarmName = getAlarmName(tabId);
  await chrome.alarms.clear(alarmName);
  chrome.alarms.create(alarmName, {
    periodInMinutes: Math.max(intervalSeconds / 60, MIN_ALARM_PERIOD_MINUTES)
  });
}

async function forceNavigate(tabId, baseUrl) {
  const target = appendBypassParam(baseUrl);
  try {
    await chrome.tabs.update(tabId, { url: target });
  } catch {
    await disableConfig(tabId);
  }
}

function appendBypassParam(baseUrl) {
  const url = new URL(baseUrl);
  url.searchParams.set("refresh_nonce", Date.now().toString());
  return url.toString();
}

function clampInterval(intervalSeconds) {
  const parsed = Number(intervalSeconds);
  if (!Number.isFinite(parsed)) {
    return 30;
  }
  return Math.min(Math.max(Math.round(parsed), 6), 3600);
}

async function processListings(tabId, listings) {
  const config = await getConfigForTab(tabId);
  if (!config?.enabled || !config.webhookUrl) {
    return;
  }

  const filtered = (listings || [])
    .map((item) => ({
      key: String(item.key || "").trim(),
      title: String(item.title || "").trim(),
      url: String(item.url || "").trim(),
      price: String(item.price || "").trim()
    }))
    .filter((item) => item.key && item.title && item.url && item.price);

  if (!filtered.length) {
    return;
  }

  const seen = await getSeenListings();
  const tabSeen = new Set(seen[String(tabId)] || []);

  for (const item of filtered) {
    if (tabSeen.has(item.key)) {
      continue;
    }

    tabSeen.add(item.key);
    await sendWebhook(config.webhookUrl, {
      title: item.title,
      url: item.url,
      price: item.price
    });
  }

  seen[String(tabId)] = Array.from(tabSeen).slice(-MAX_SEEN_LISTINGS_PER_TAB);
  await chrome.storage.local.set({ [SEEN_LISTINGS_KEY]: seen });
}

async function sendWebhook(webhookUrl, payload) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error("Webhook request failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Webhook request error:", error);
  }
}
