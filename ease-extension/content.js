console.log("Ease extension loaded");

function disableAnimations() {
  document.querySelectorAll("*").forEach(el => {
    el.style.animation = "none";
    el.style.transition = "none";
  });

  document.querySelectorAll("video").forEach(v => v.pause());
}