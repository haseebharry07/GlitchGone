(function () {
  const DEBUG = true;
  const log = (...args) => { if (DEBUG) console.log('[ThemeBuilder]', ...args); };

  /* ================= Config ================= */
  const allowedKeys = [btoa("0-373-489")]; // Allowed base64 rlno values
  const MAX_ATTEMPTS = 40; // Retry attempts (~8 seconds)

  /* ================= Load CSS ================= */
  function loadThemeBuilderCSS() {
    if (!document.getElementById('themeBuilderCSS')) {
      const link = document.createElement('link');
      link.id = 'themeBuilderCSS';
      link.rel = 'stylesheet';
      link.href = 'https://glitch-gone.vercel.app/theme-builder.css';
      document.head.appendChild(link);
      log('CSS loaded');
    }
  }
  loadThemeBuilderCSS();

  /* ================= Utilities ================= */
  function createSection(title, contentBuilder) {
    const section = document.createElement("div");
    section.className = "tb-section";
    const header = document.createElement("div");
    header.className = "tb-section-header";
    header.textContent = title;
    const content = document.createElement("div");
    content.className = "tb-section-content";
    header.addEventListener("click", () => {
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
    section.appendChild(header);
    section.appendChild(content);
    contentBuilder(content);
    return section;
  }

  function initTooltip(btn, text) {
    const tooltip = document.createElement("div");
    tooltip.className = "tb-tooltip";
    tooltip.textContent = text;
    btn.appendChild(tooltip);
    btn.addEventListener("mouseenter", () => { tooltip.style.visibility = "visible"; tooltip.style.opacity = "1"; });
    btn.addEventListener("mouseleave", () => { tooltip.style.visibility = "hidden"; tooltip.style.opacity = "0"; });
  }

  /* ================= Color Picker ================= */
  function createColorPicker(labelText, storageKey, cssVar) {
    const wrapper = document.createElement("div");
    wrapper.className = "tb-color-picker-wrapper";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.className = "tb-color-picker-label";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = localStorage.getItem(storageKey) || "#007bff";
    colorInput.className = "tb-color-input";

    const colorCode = document.createElement("span");
    colorCode.className = "tb-color-code";
    colorCode.textContent = colorInput.value;

    colorCode.addEventListener("click", () => {
      navigator.clipboard.writeText(colorCode.textContent).then(() => {
        colorCode.style.background = "#c8e6c9";
        setTimeout(() => (colorCode.style.background = "#f0f0f0"), 800);
      });
    });

    colorInput.addEventListener("input", () => {
      const color = colorInput.value;
      colorCode.textContent = color;
      localStorage.setItem(storageKey, color);
      if (cssVar) document.body.style.setProperty(cssVar, color);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(colorInput);
    wrapper.appendChild(colorCode);
    return wrapper;
  }

  function buildThemeColorsSection(container) {
    const colors = [
      { label: "Choose Primary Color", key: "primaryColor", var: "--primary-color" },
      { label: "Choose Primary BG Color", key: "primaryBgColor", var: "--primary-bg-color" },
      { label: "Left Sidebar BG Color", key: "sidebarBgColor", var: "--sidebar-bg-color" },
      { label: "Left Sidebar Text Color", key: "sidebarTextColor", var: "--sidebar-text-color" },
      { label: "Left Sidebar Icon Color", key: "sidebarIconColor", var: "--sidebar-icon-color" },
    ];
    colors.forEach(c => container.appendChild(createColorPicker(c.label, c.key, c.var)));
  }

  function buildButtonStyleSection(container) {
    const info = document.createElement("p");
    info.textContent = "Adjust button radius and preview below.";
    info.className = "tb-info";
    container.appendChild(info);

    const controlRow = document.createElement("div");
    controlRow.className = "tb-control-row";

    const radiusLabel = document.createElement("label");
    radiusLabel.textContent = "Radius:";
    radiusLabel.className = "tb-radius-label";

    const radiusInput = document.createElement("input");
    radiusInput.type = "range"; radiusInput.min = "0"; radiusInput.max = "50";
    radiusInput.value = localStorage.getItem("btnRadius") || 8;
    radiusInput.className = "tb-radius-input";

    const radiusVal = document.createElement("span");
    radiusVal.textContent = radiusInput.value + "px";
    radiusVal.className = "tb-radius-value";

    controlRow.appendChild(radiusLabel);
    controlRow.appendChild(radiusInput);
    controlRow.appendChild(radiusVal);
    container.appendChild(controlRow);

    const sample = document.createElement("button");
    sample.textContent = "Sample Button";
    sample.className = "btn-theme";
    container.appendChild(sample);

    radiusInput.addEventListener("input", () => {
      const v = radiusInput.value;
      radiusVal.textContent = v + "px";
      localStorage.setItem("btnRadius", v);
      sample.style.borderRadius = v + "px";
      document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = v + "px");
    });
  }

  /* ================= Builder UI ================= */
  let headerObserver = null;

  function createBuilderUI(controlsContainer) {
    if (!controlsContainer || document.getElementById("hl_header--themebuilder-icon")) return;

    // Button
    const btn = document.createElement("a");
    btn.href = "javascript:void(0);";
    btn.id = "hl_header--themebuilder-icon";
    btn.innerHTML = `<span style="font-size:18px;">🖌️</span>`;
    initTooltip(btn, "Theme Builder");
    controlsContainer.appendChild(btn);

    // Drawer
    if (!document.getElementById('themeBuilderDrawer')) {
      const drawer = document.createElement("div");
      drawer.id = "themeBuilderDrawer";

      // Header
      const headerBar = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = 'Theme Builder';
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      headerBar.appendChild(title);
      headerBar.appendChild(closeBtn);
      drawer.appendChild(headerBar);

      // Content
      const contentWrapper = document.createElement('div');
      drawer.appendChild(contentWrapper);

      // Sections
      contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
      contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

      document.body.appendChild(drawer);

      // Toggle
      btn.addEventListener('click', () => drawer.style.right = '0');
      closeBtn.addEventListener('click', () => drawer.style.right = '-420px');

      applySavedSettings();
    }
  }

  function applySavedSettings() {
    ["primaryColor", "primaryBgColor", "sidebarBgColor", "sidebarTextColor", "sidebarIconColor"].forEach(key => {
      const val = localStorage.getItem(key);
      if (val) document.body.style.setProperty("--" + key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()), val);
    });
    const savedRadius = localStorage.getItem("btnRadius");
    if (savedRadius) document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = savedRadius + "px");
  }

  function findControlsContainer() {
    const header = document.querySelector('header.hl_header') || document.querySelector('header');
    if (!header) return null;
    const controls = header.querySelectorAll('.hl_header--controls');
    if (!controls.length) return null;
    return Array.from(controls).sort((a,b) => b.childElementCount - a.childElementCount)[0];
  }

  function initThemeBuilder(attempts = 0) {
    const rlno = localStorage.getItem('rlno');
    if (!rlno) {
      if (attempts < MAX_ATTEMPTS) setTimeout(() => initThemeBuilder(attempts + 1), 200);
      return;
    }
    if (!allowedKeys.includes(rlno)) return; // unauthorized

    const controlsContainer = findControlsContainer();
    if (!controlsContainer) {
      if (attempts < MAX_ATTEMPTS) setTimeout(() => initThemeBuilder(attempts + 1), 200);
      return;
    }

    createBuilderUI(controlsContainer);

    // Observe header for SPA changes
    const headerEl = document.querySelector('header.hl_header') || document.querySelector('header');
    if (headerEl && !headerObserver) {
      headerObserver = new MutationObserver(() => {
        if (!document.getElementById('hl_header--themebuilder-icon')) setTimeout(() => initThemeBuilder(0), 200);
      });
      headerObserver.observe(headerEl, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => initThemeBuilder(0), 50));
  setTimeout(() => initThemeBuilder(0), 50);

})();
