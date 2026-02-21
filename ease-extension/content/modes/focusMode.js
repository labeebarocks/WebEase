(() => {
  const STYLE_ID = "ease-focus-mode-style";
  const BODY_CLASS = "ease-focus-mode-on";
  const ACTIVE_CLASS = "ease-focus-active";

  // CSS: dim everything, but keep the active paragraph bright + highlighted
  const CSS = `
    body.${BODY_CLASS} * {
      opacity: 0.28 !important;
      transition: opacity 120ms ease !important;
    }

    body.${BODY_CLASS} p.${ACTIVE_CLASS},
    body.${BODY_CLASS} p.${ACTIVE_CLASS} * {
      opacity: 1 !important;
    }

    body.${BODY_CLASS} p.${ACTIVE_CLASS} {
      background: rgba(255, 255, 0, 0.25) !important;
      outline: 2px solid rgba(255, 255, 0, 0.85) !important;
      outline-offset: 2px !important;
      border-radius: 6px !important;
    }
  `;

  let enabled = false;
  let lastActive = null;
  let rafPending = false;

  function clearActive() {
    if (lastActive) {
      lastActive.classList.remove(ACTIVE_CLASS);
      lastActive = null;
    }
  }

  function getParagraphFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest ? el.closest("p") : null;
  }

  function updateFromMouse(e) {
    if (!enabled) return;

    // throttle to animation frames
    if (rafPending) return;
    rafPending = true;

    const x = e.clientX;
    const y = e.clientY;

    requestAnimationFrame(() => {
      rafPending = false;
      if (!enabled) return;

      const p = getParagraphFromPoint(x, y);

      if (!p) {
        // If you want "no paragraph = nothing highlighted", keep this:
        clearActive();
        return;
      }

      if (p === lastActive) return;

      clearActive();
      p.classList.add(ACTIVE_CLASS);
      lastActive = p;
    });
  }

  function enable() {
    if (enabled) return;
    enabled = true;

    window.__EASE_DOM__.injectStyleTag(STYLE_ID, CSS);
    document.body.classList.add(BODY_CLASS);

    // capture=true helps catch events even if page stops propagation
    document.addEventListener("mousemove", updateFromMouse, true);
  }

  function disable() {
    if (!enabled) return;
    enabled = false;

    document.removeEventListener("mousemove", updateFromMouse, true);
    document.body.classList.remove(BODY_CLASS);
    clearActive();

    window.__EASE_DOM__.removeStyleTag(STYLE_ID);
  }

  window.__EASE_MODES__ = window.__EASE_MODES__ || {};
  window.__EASE_MODES__.focusMode = { enable, disable };
})();