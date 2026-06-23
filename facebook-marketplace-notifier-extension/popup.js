const marketplaceUrlInput = document.getElementById("marketplaceUrl");
const webhookUrlInput = document.getElementById("webhookUrl");
const intervalSecondsInput = document.getElementById("intervalSeconds");
const statusEl = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let activeTabId = null;

bootstrap().catch((error) => setStatus(error.message, true));

startBtn.addEventListener("click", () => {
  saveAndStart().catch((error) => setStatus(error.message, true));
});

stopBtn.addEventListener("click", () => {
  stopMonitoring().catch((error) => setStatus(error.message, true));
});

async function bootstrap() {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error("Open a Marketplace tab first.");
  }

  activeTabId = tab.id;

  if (tab.url && tab.url.includes("facebook.com/marketplace")) {
    marketplaceUrlInput.value = tab.url;
  }

  const response = await sendMessage({ type: "getConfig", tabId: activeTabId });
  if (response?.config) {
    marketplaceUrlInput.value = response.config.marketplaceUrl || marketplaceUrlInput.value;
    webhookUrlInput.value = response.config.webhookUrl || "";
    intervalSecondsInput.value = String(response.config.intervalSeconds || 30);
    setStatus(response.config.enabled ? "Monitoring is ON." : "Monitoring is saved but OFF.");
  } else {
    setStatus("Set your URL + webhook, then start.");
  }
}

async function saveAndStart() {
  ensureTabId();

  const marketplaceUrl = marketplaceUrlInput.value.trim();
  const webhookUrl = webhookUrlInput.value.trim();
  const intervalSeconds = Number(intervalSecondsInput.value || 30);

  validateInputs(marketplaceUrl, webhookUrl, intervalSeconds);
  await ensureWebhookPermission(webhookUrl);

  await sendMessage({
    type: "upsertConfig",
    config: {
      tabId: activeTabId,
      marketplaceUrl,
      webhookUrl,
      intervalSeconds,
      enabled: true
    }
  });

  setStatus("Monitoring started.");
}

async function stopMonitoring() {
  ensureTabId();
  await sendMessage({ type: "disableConfig", tabId: activeTabId });
  setStatus("Monitoring stopped.");
}

function validateInputs(marketplaceUrl, webhookUrl, intervalSeconds) {
  const marketplace = new URL(marketplaceUrl);
  const isFacebookHost =
    marketplace.hostname === "facebook.com" ||
    marketplace.hostname === "www.facebook.com" ||
    marketplace.hostname.endsWith(".facebook.com");
  if (!isFacebookHost || !marketplace.pathname.includes("/marketplace")) {
    throw new Error("Marketplace URL must be a Facebook Marketplace link.");
  }

  new URL(webhookUrl);

  if (!Number.isFinite(intervalSeconds) || intervalSeconds < 6 || intervalSeconds > 3600) {
    throw new Error("Interval must be between 6 and 3600 seconds.");
  }
}

function ensureTabId() {
  if (!Number.isFinite(activeTabId)) {
    throw new Error("Active tab not found.");
  }

  function ensureWebhookPermission(webhookUrl) {
    return new Promise((resolve, reject) => {
      const originPattern = `${new URL(webhookUrl).origin}/*`;
      chrome.permissions.request({ origins: [originPattern] }, (granted) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!granted) {
          reject(new Error("Webhook permission denied."));
          return;
        }
        resolve();
      });
    });
  }
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b00020" : "#0f7d00";
}

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs?.[0] || null);
    });
  });
}

function sendMessage(payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.error || "Request failed."));
        return;
      }
      resolve(response);
    });
  });
}
