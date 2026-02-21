import { injectStyleTag, removeStyleTag } from "../utils/dom.js";

const STYLE_ID = "ease-high-contrast-style";

const CSS = `
  /* High contrast overrides (MVP) */
  html, body {
    background: #000 !important;
    color: #fff !important;
  }

  * {
    color: #fff !important;
    background-color: transparent !important;
    border-color: #fff !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  a, a * {
    color: #00ffff !important;
    text-decoration: underline !important;
  }

  button, input, select, textarea {
    background: #000 !important;
    color: #fff !important;
    border: 2px solid #fff !important;
  }

  :focus {
    outline: 3px solid #ffff00 !important;
    outline-offset: 2px !important;
  }
`;

export function enableHighContrast() {
  injectStyleTag(STYLE_ID, CSS);
}

export function disableHighContrast() {
  removeStyleTag(STYLE_ID);
}