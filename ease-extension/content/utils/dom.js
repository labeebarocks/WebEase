(() => {
  function injectStyleTag(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  function removeStyleTag(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // expose globally (so other files can use it without import)
  window.__EASE_DOM__ = { injectStyleTag, removeStyleTag };
})();