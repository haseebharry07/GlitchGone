(function () {
  const DEBUG = true;
  const log = (...args) => { if (DEBUG) console.log('[ThemeBuilder]', ...args); };

  const allowedKeys = [btoa("0-373-489")];
  const MAX_ATTEMPTS = 40;

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

  function createSection(title, contentBuilder) {
    const section = document.createElement("div");
    section.className = "tb-section";

    const header = document.createElement("div");
    header.className = "tb-section-header";
    header.textContent = title;

    const content = document.createElement("div");
    content.className = "tb-section-content";

    header.addEventListener("click", () => {
      content.classList.toggle("open");
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

    // Position tooltip below the button
    btn.style.position = 'relative';

    btn.addEventListener("mouseenter", () => {
      tooltip.classList.add("visible");
    });
    btn.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  }

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
        colorCode.classList.add("copied");
        setTimeout(() => colorCode.classList.remove("copied"), 800);
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
    { label: "Left Sidebar Tabs Color", key: "sidebarTextColor", var: null }, // null because applied via JS
    { label: "Left Sidebar Tabs Hover Color", key: "sidebarIconColor", var: null }, // applied via JS
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
    radiusInput.type = "range";
    radiusInput.min = "0";
    radiusInput.max = "50";
    radiusInput.value = localStorage.getItem("btnRadius") || 8;
    radiusInput.className = "tb-radius-input";

    const radiusVal = document.createElement("span");
    radiusVal.textContent = radiusInput.value + "px";
    radiusVal.className = "tb-radius-value";

    controlRow.appendChild(radiusLabel);
    controlRow.appendChild(radiusInput);
    controlRow.appendChild(radiusVal);
    container.appendChild(controlRow);

    radiusInput.addEventListener("input", () => {
      const v = radiusInput.value;
      radiusVal.textContent = v + "px";
      localStorage.setItem("btnRadius", v);
      document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = v + "px");
    });
  }

  let headerObserver = null;

  function createBuilderUI(controlsContainer) {
    if (!controlsContainer || document.getElementById("hl_header--themebuilder-icon")) return;

    const btn = document.createElement("a");
    btn.href = "javascript:void(0);";
    btn.id = "hl_header--themebuilder-icon";
    btn.className = "tb-btn-icon";
    btn.innerHTML = `<span style="font-size:18px;">🖌️</span>`;
    initTooltip(btn, "Theme Builder");
    controlsContainer.appendChild(btn);

    if (!document.getElementById('themeBuilderDrawer')) {
      const drawer = document.createElement("div");
      drawer.id = "themeBuilderDrawer";

      drawer.className = "tb-drawer"; // use CSS class for all positioning

      const headerBar = document.createElement('div');
      headerBar.className = "tb-drawer-header";

      const title = document.createElement('div');
      title.textContent = 'Theme Builder';
      title.className = "tb-drawer-title";

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.className = "tb-drawer-close";

      headerBar.appendChild(title);
      headerBar.appendChild(closeBtn);
      drawer.appendChild(headerBar);

      const contentWrapper = document.createElement('div');
      contentWrapper.className = "tb-drawer-content";
      drawer.appendChild(contentWrapper);

      contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
      contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

      document.body.appendChild(drawer);

      btn.addEventListener('click', () => drawer.classList.add('open'));
      closeBtn.addEventListener('click', () => drawer.classList.remove('open'));

      applySavedSettings();
    }
  }

  function applySavedSettings() {
  // Theme colors
  const colorMap = [
    { key: "primaryColor", cssVar: "--primary-color" },
    { key: "primaryBgColor", cssVar: "--primary-bg-color" },
    { key: "sidebarBgColor", cssVar: "--sidebar-bg-color" },
  ];
  
  colorMap.forEach(c => {
    const val = localStorage.getItem(c.key);
    if (val) document.body.style.setProperty(c.cssVar, val);
  });

  // Sidebar text color (menu links)
  const sidebarTextColor = localStorage.getItem("sidebarTextColor");
  if (sidebarTextColor) {
    const links = document.querySelectorAll('#sidebar-v2 a');
    links.forEach(a => {
      a.style.color = sidebarTextColor;
    });
  }

  // Sidebar tabs color (used to be sidebarIconColor)
  const sidebarTabColor = localStorage.getItem("sidebarIconColor");
  if (sidebarTabColor) {
    const links = document.querySelectorAll('#sidebar-v2 a');
    links.forEach(a => {
      a.style.color = sidebarTabColor;
    });
  }

  // Button radius
  const savedRadius = localStorage.getItem("btnRadius");
  if (savedRadius) {
    document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = savedRadius + "px");
  }
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
    if (!allowedKeys.includes(rlno)) return;

    const controlsContainer = findControlsContainer();
    if (!controlsContainer) {
      if (attempts < MAX_ATTEMPTS) setTimeout(() => initThemeBuilder(attempts + 1), 200);
      return;
    }

    createBuilderUI(controlsContainer);

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
