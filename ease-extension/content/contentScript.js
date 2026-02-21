import { enableSeizureSafe, disableSeizureSafe } from "./modes/seizureSafe.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TOGGLE_SEIZURE_SAFE") {
    if (msg.enabled) enableSeizureSafe();
    else disableSeizureSafe();
    sendResponse({ ok: true });
  }
});

import { enableSeizureSafe, disableSeizureSafe } from "./modes/seizureSafe.js";
import { enableHighContrast, disableHighContrast } from "./modes/highContrast.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TOGGLE_SEIZURE_SAFE") {
    if (msg.enabled) enableSeizureSafe();
    else disableSeizureSafe();
    sendResponse({ ok: true });
    return;
  }

  if (msg.type === "TOGGLE_HIGH_CONTRAST") {
    if (msg.enabled) enableHighContrast();
    else disableHighContrast();
    sendResponse({ ok: true });
    return;
  }
});