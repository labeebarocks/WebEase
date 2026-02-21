document.getElementById("seizure").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // track enabled state however you want (local variable or chrome.storage)
  const enabled = true;

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_SEIZURE_SAFE",
    enabled
  });
});