(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("cv-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  function syncButton(btn) {
    const dark = root.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "☀ Light" : "☾ Dark";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    syncButton(btn);
    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("cv-theme", next);
      syncButton(btn);
    });
  });
})();
