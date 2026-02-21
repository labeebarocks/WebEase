let enabled = false;

const btn = document.getElementById("seizure");
const statusEl = document.getElementById("status");


const CONTENT_SCRIPT_FILES = [
  "content/utils/dom.js",
  "content/modes/contrastMode.js",
  "content/contentScript.js"
];

function sendToggleHighContrast(tabId, enabled, callback) {
  chrome.tabs.sendMessage(
    tabId,
    { type: "TOGGLE_HIGH_CONTRAST", enabled },
    (res) => {
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError);
        return;
      }
      callback(null, res);
    }
  );
}

document.getElementById("highContrast").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  enabled = !enabled;

  sendToggleHighContrast(tab.id, enabled, async (err, res) => {
    if (err && err.message && err.message.includes("Receiving end does not exist")) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: CONTENT_SCRIPT_FILES
        });
        sendToggleHighContrast(tab.id, enabled, (err2, res2) => {
          if (err2) console.error("SendMessage error:", err2.message);
          else console.log("Response:", res2);
        });
      } catch (e) {
        console.error("Inject error:", e);
      }
      return;
    }
    if (err) console.error("SendMessage error:", err.message);
    else console.log("Response:", res);
  });
});

// functions for seizure-safe mode
function isRestrictedUrl(url) {
  return (
    !url ||
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:")
  );
}

function keyForTab(tab) {
  // Store state per-tab-id (simple + matches what the user sees)
  return `seizureSafe:tab:${tab.id}`;
}

function setButtonUI(enabled) {
  btn.textContent = `Seizure Safe: ${enabled ? "ON" : "OFF"}`;
  btn.setAttribute("aria-pressed", enabled ? "true" : "false");
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function loadStateForTab(tab) {
  const key = keyForTab(tab);
  const data = await chrome.storage.local.get([key]);
  return Boolean(data[key]);
}

async function saveStateForTab(tab, enabled) {
  const key = keyForTab(tab);
  await chrome.storage.local.set({ [key]: enabled });
}

async function sendToggle(tab, enabled) {
  // Send to content script (must be injected on that page)
  return chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_SEIZURE_SAFE",
    enabled
  });
}

// Initialize button state when popup opens
(async () => {
  const tab = await getActiveTab();

  if (isRestrictedUrl(tab.url)) {
    btn.disabled = true;
    if (statusEl) statusEl.textContent = "Open a normal website tab to use this.";
    setButtonUI(false);
    return;
  }

  const enabled = await loadStateForTab(tab);
  setButtonUI(enabled);
  if (statusEl) statusEl.textContent = "Ready.";
})();

btn.addEventListener("click", async () => {
  const tab = await getActiveTab();

  if (isRestrictedUrl(tab.url)) {
    if (statusEl) statusEl.textContent = "Cannot run on Chrome internal pages.";
    return;
  }

  const current = await loadStateForTab(tab);
  const next = !current;

  try {
    await sendToggle(tab, next);
    await saveStateForTab(tab, next);
    setButtonUI(next);
    if (statusEl) statusEl.textContent = next ? "Seizure-safe enabled." : "Seizure-safe disabled.";
  } catch (e) {
    // // If content script isn't available (some pages block it), show message
    // if (statusEl) statusEl.textContent = "Could not apply on this page.";
    
    // console.error("Extension toggle error:", e);
    
    // if (chrome.runtime.lastError) {
    //   console.error("Chrome lastError:", chrome.runtime.lastError.message);
    // }

    
  }
});