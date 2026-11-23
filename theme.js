(function () {
  const root = document.documentElement;
  const cfg = Object.assign(
    { theme: "light", palette: "plum", font: "geometric", layout: "split", showStudio: true },
    window.SITE_THEME || {}
  );

  const VALID = {
    theme: ["light", "dark"],
    palette: ["plum", "mono", "blue", "cyan", "gold"],
    font: ["geometric", "editorial", "swiss", "terminal"],
    layout: ["split", "stacked", "wide"],
  };

  const params = new URLSearchParams(window.location.search);
  const pick = (key) => {
    const fromUrl = params.get(key);
    if (fromUrl && VALID[key].includes(fromUrl)) return fromUrl;
    const fromStore = localStorage.getItem("cv-" + key);
    if (fromStore && VALID[key].includes(fromStore)) return fromStore;
    return cfg[key];
  };

  const state = {
    theme: pick("theme"),
    palette: pick("palette"),
    font: pick("font"),
    layout: pick("layout"),
  };

  const showStudio = params.has("studio") ? params.get("studio") !== "0" : cfg.showStudio !== false;

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

  function shareUrl() {
    const u = new URL(window.location.href);
    u.searchParams.set("palette", state.palette);
    u.searchParams.set("theme", state.theme);
    u.searchParams.set("font", state.font);
    u.searchParams.set("layout", state.layout);
    u.searchParams.set("studio", "0");
    return u.toString();
  }

  function configSnippet() {
    return `window.SITE_THEME = {\n  theme: "${state.theme}",\n  palette: "${state.palette}",\n  font: "${state.font}",\n  layout: "${state.layout}",\n  showStudio: false,\n};`;
  }

  function copyText(text, btn, label) {
    const done = () => {
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = label; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => window.prompt("Copy:", text));
    } else {
      window.prompt("Copy:", text);
    }
  }

  function syncUI() {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const dark = state.theme === "dark";
      btn.textContent = dark ? "☀ Light" : "☾ Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    document.querySelectorAll(".studio-chip[data-key]").forEach((chip) => {
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
    fab.setAttribute("aria-expanded", "false");

    const panel = document.createElement("aside");
    panel.className = "studio-panel";
    panel.hidden = true;
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
      <div class="studio-group">
        <span class="studio-label">Share or save as default</span>
        <div class="studio-chips">
          <button class="studio-chip" type="button" id="studio-copy-link">Copy share link</button>
          <button class="studio-chip" type="button" id="studio-copy-cfg">Copy site-theme.js</button>
          <button class="studio-chip" type="button" id="studio-reset">Reset</button>
        </div>
      </div>
      <div class="studio-code" id="studio-code"></div>
    `;

    const toggle = () => {
      panel.hidden = !panel.hidden;
      fab.setAttribute("aria-expanded", String(!panel.hidden));
    };
    fab.addEventListener("click", toggle);
    panel.querySelector(".studio-close").addEventListener("click", toggle);
    panel.addEventListener("click", (e) => {
      const chip = e.target.closest(".studio-chip[data-key]");
      if (!chip) return;
      state[chip.dataset.key] = chip.dataset.val;
      apply();
      syncUI();
    });
    panel.querySelector("#studio-copy-link").addEventListener("click", function () {
      copyText(shareUrl(), this, "Copy share link");
    });
    panel.querySelector("#studio-copy-cfg").addEventListener("click", function () {
      copyText(configSnippet(), this, "Copy site-theme.js");
    });
    panel.querySelector("#studio-reset").addEventListener("click", () => {
      Object.assign(state, { theme: cfg.theme, palette: cfg.palette, font: cfg.font, layout: cfg.layout });
      ["theme", "palette", "font", "layout"].forEach((k) => localStorage.removeItem("cv-" + k));
      apply();
      syncUI();
    });

    document.body.append(panel, fab);
    const nav = document.querySelector("header nav");
    if (nav) {
      const navBtn = document.createElement("button");
      navBtn.className = "theme-toggle";
      navBtn.type = "button";
      navBtn.textContent = "Themes";
      navBtn.addEventListener("click", toggle);
      nav.appendChild(navBtn);
    }
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
    if (showStudio) buildStudio();
    syncUI();
  });
})();
