let enabled = false;

document.getElementById("highContrast").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  enabled = !enabled;

  chrome.tabs.sendMessage(
    tab.id,
    { type: "TOGGLE_HIGH_CONTRAST", enabled },
    (res) => {
      if (chrome.runtime.lastError) {
        console.error("SendMessage error:", chrome.runtime.lastError.message);
        return;
      }
      console.log("Response:", res);
    }
  );
});