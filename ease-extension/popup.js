document.getElementById("seizure").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // track enabled state however you want (local variable or chrome.storage)
  const enabled = true;

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_SEIZURE_SAFE",
    enabled
  });
});


async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getFlag(key) {
  const res = await chrome.storage.local.get([key]);
  return Boolean(res[key]);
}

async function setFlag(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

document.getElementById("highContrast").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  const key = "highContrastEnabled";
  const current = await getFlag(key);
  const enabled = !current;

  await setFlag(key, enabled);

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_HIGH_CONTRAST",
    enabled,
  });
});

document.getElementById("seizure").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  const key = "seizureSafeEnabled";
  const current = await getFlag(key);
  const enabled = !current;

  await setFlag(key, enabled);

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_SEIZURE_SAFE",
    enabled,
  });
});
