import { enableSeizureSafe, disableSeizureSafe } from "./modes/seizureSafe.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TOGGLE_SEIZURE_SAFE") {
    if (msg.enabled) enableSeizureSafe();
    else disableSeizureSafe();
    sendResponse({ ok: true });
  }
});