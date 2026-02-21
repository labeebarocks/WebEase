document.getElementById("seizure").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      document.querySelectorAll("*").forEach(el => {
        el.style.animation = "none";
        el.style.transition = "none";
      });

      document.querySelectorAll("video").forEach(v => v.pause());
    }
  });
});