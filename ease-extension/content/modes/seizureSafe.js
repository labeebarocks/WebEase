import { injectStyleTag, removeStyleTag } from "../utils/dom.js";

const STYLE_ID = "ease-seizure-safe-style";

const CSS = `
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
`;

export function enableSeizureSafe() {
  injectStyleTag(STYLE_ID, CSS);

  // Pause media (don’t auto-resume on disable—can surprise users)
  document.querySelectorAll("video, audio").forEach((m) => {
    try { m.pause(); } catch {}
  });
}

export function disableSeizureSafe() {
  removeStyleTag(STYLE_ID);
}