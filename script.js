// GK Studio — subtle scroll reveal, no visual redesign, just fade/translate-in
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => io.observe(el));

  // play buttons: placeholder click feedback only (no video wired yet)
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.style.transform = "translate(-50%, -50%) scale(0.92)";
      setTimeout(() => {
        btn.style.transform = "translate(-50%, -50%) scale(1)";
      }, 150);
    });
  });
});
