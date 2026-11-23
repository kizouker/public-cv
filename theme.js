(function () {
  const root = document.documentElement;
  const defaults = { theme: "light", palette: "plum", font: "geometric", layout: "split" };
  const state = {
    theme: localStorage.getItem("cv-theme") || defaults.theme,
    palette: localStorage.getItem("cv-palette") || defaults.palette,
    font: localStorage.getItem("cv-font") || defaults.font,
    layout: localStorage.getItem("cv-layout") || defaults.layout,
  };

  function apply() {
    root.setAttribute("data-theme", state.theme);
    root.setAttribute("data-palette", state.palette);
    root.setAttribute("data-font", state.font);
    root.setAttribute("data-layout", state.layout);
    localStorage.setItem("cv-theme", state.theme);
    localStorage.setItem("cv-palette", state.palette);
    localStorage.setItem("cv-font", state.font);
    localStorage.setItem("cv-layout", state.layout);
  }
  apply();

  const PALETTES = [
    ["plum", "Plum & Slate", "#6d28d9"],
    ["mono", "Graphite Mono", "#18181b"],
    ["blue", "Nordic Blue", "#2563eb"],
    ["cyan", "Midnight Cyan", "#0891b2"],
    ["gold", "Charcoal & Gold", "#a16207"],
  ];
  const FONTS = [
    ["geometric", "Space Grotesk"],
    ["editorial", "Newsreader Serif"],
    ["swiss", "Inter Swiss"],
    ["terminal", "JetBrains + Plex"],
  ];
  const LAYOUTS = [
    ["split", "Editorial Split"],
    ["stacked", "Classic Stacked"],
    ["wide", "Wide Bento"],
  ];

  function syncUI() {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const dark = state.theme === "dark";
      btn.textContent = dark ? "☀ Light" : "☾ Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    document.querySelectorAll(".studio-chip").forEach((chip) => {
      chip.classList.toggle("active", state[chip.dataset.key] === chip.dataset.val);
    });
    const code = document.getElementById("studio-code");
    if (code) code.textContent = `${state.palette} · ${state.theme} · ${state.font} · ${state.layout}`;
  }

  function buildStudio() {
    const fab = document.createElement("button");
    fab.className = "studio-fab";
    fab.type = "button";
    fab.textContent = "Style Studio";
    fab.setAttribute("aria-expanded", "true");

    const panel = document.createElement("aside");
    panel.className = "studio-panel";
    panel.setAttribute("aria-label", "Style switcher");
    panel.innerHTML = `
      <div class="studio-head">
        <strong>Style Studio</strong>
        <button class="studio-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="studio-group">
        <span class="studio-label">Color palette</span>
        <div class="studio-chips">${PALETTES.map(([v, l, c]) =>
          `<button class="studio-chip" type="button" data-key="palette" data-val="${v}"><span class="swatch" style="background:${c}"></span>${l}</button>`
        ).join("")}</div>
      </div>
      <div class="studio-group">
        <span class="studio-label">Mode</span>
        <div class="studio-chips">
          <button class="studio-chip" type="button" data-key="theme" data-val="light">☀ Light</button>
          <button class="studio-chip" type="button" data-key="theme" data-val="dark">☾ Dark</button>
        </div>
      </div>
      <div class="studio-group">
        <span class="studio-label">Typography</span>
        <div class="studio-chips">${FONTS.map(([v, l]) =>
          `<button class="studio-chip" type="button" data-key="font" data-val="${v}">${l}</button>`
        ).join("")}</div>
      </div>
      <div class="studio-group">
        <span class="studio-label">Layout</span>
        <div class="studio-chips">${LAYOUTS.map(([v, l]) =>
          `<button class="studio-chip" type="button" data-key="layout" data-val="${v}">${l}</button>`
        ).join("")}</div>
      </div>
      <div class="studio-code" id="studio-code"></div>
    `;

    fab.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      fab.setAttribute("aria-expanded", String(!panel.hidden));
    });
    panel.querySelector(".studio-close").addEventListener("click", () => {
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
    });
    panel.addEventListener("click", (e) => {
      const chip = e.target.closest(".studio-chip");
      if (!chip) return;
      state[chip.dataset.key] = chip.dataset.val;
      apply();
      syncUI();
    });

    document.body.append(panel, fab);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        state.theme = state.theme === "dark" ? "light" : "dark";
        apply();
        syncUI();
      });
    }
    buildStudio();
    syncUI();
  });
})();
