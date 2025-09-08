(function () {
  const DEBUG = true;
  const log = (...args) => { if (DEBUG) console.log('[ThemeBuilder]', ...args); };

  /* ================= Config ================= */
  const allowedKeys = [btoa("0-373-489")]; // allowed base64 rlno values
  const MAX_ATTEMPTS = 40; // ~40 * 200ms = 8 seconds retry window

  /* ================= Utilities ================= */
  function createSection(title, contentBuilder) {
    const section = document.createElement("div");
    section.style.cssText = `border:1px solid #ccc; border-radius:6px; margin-bottom:10px; overflow:hidden;`;
    const header = document.createElement("div");
    header.textContent = title;
    header.style.cssText = `padding:10px; background:#f5f5f5; cursor:pointer; font-weight:bold;`;
    const content = document.createElement("div");
    content.style.cssText = `display:none; padding:15px; background:#fff;`;
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
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position:absolute; top:110%; left:50%; transform:translateX(-50%);
      background-color:green; color:#fff; padding:5px 8px; border-radius:4px;
      font-size:12px; white-space:nowrap; visibility:hidden; opacity:0;
      transition:opacity 0.25s; z-index:10000;
    `;
    btn.appendChild(tooltip);
    btn.addEventListener("mouseenter", () => { tooltip.style.visibility = "visible"; tooltip.style.opacity = "1"; });
    btn.addEventListener("mouseleave", () => { tooltip.style.visibility = "hidden"; tooltip.style.opacity = "0"; });
  }

  /* ================= Color Picker Utility ================= */
  function createColorPicker(labelText, storageKey, cssVar) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex; align-items:center; gap:10px; margin-bottom:10px;`;
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.cssText = "min-width:150px; font-weight:bold;";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = localStorage.getItem(storageKey) || "#007bff";
    colorInput.style.cssText = "width:50px; height:40px; border:none; cursor:pointer;";
    const colorCode = document.createElement("span");
    colorCode.textContent = colorInput.value;
    colorCode.style.cssText = `font-family:monospace; font-size:14px; cursor:pointer; color:#333; background:#f0f0f0; padding:5px 10px; border-radius:4px;`;
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
    info.style.cssText = "margin:0 0 10px 0; font-size:14px;";
    container.appendChild(info);
    const controlRow = document.createElement("div");
    controlRow.style.cssText = "display:flex; align-items:center; gap:10px; margin-bottom:10px;";
    const radiusLabel = document.createElement("label");
    radiusLabel.textContent = "Radius:";
    radiusLabel.style.cssText = "min-width:60px;";
    const radiusInput = document.createElement("input");
    radiusInput.type = "range"; radiusInput.min = "0"; radiusInput.max = "50";
    radiusInput.value = localStorage.getItem("btnRadius") || 8;
    const radiusVal = document.createElement("span");
    radiusVal.textContent = radiusInput.value + "px"; radiusVal.style.cssText = "font-family:monospace;";
    controlRow.appendChild(radiusLabel); controlRow.appendChild(radiusInput); controlRow.appendChild(radiusVal);
    container.appendChild(controlRow);
    const sample = document.createElement("button");
    sample.textContent = "Sample Button"; sample.className = "btn-theme";
    sample.style.cssText = `padding:10px 20px; border:none; border-radius:${radiusInput.value}px; background-color: var(--primary-color, #007bff); color:#fff; cursor:pointer;`;
    container.appendChild(sample);
    radiusInput.addEventListener("input", () => {
      const v = radiusInput.value; radiusVal.textContent = v + "px"; localStorage.setItem("btnRadius", v);
      sample.style.borderRadius = v + "px";
      document.querySelectorAll(".btn-theme").forEach(b => { b.style.borderRadius = v + "px"; });
    });
  }

  /* ================= Builder creation ================= */
  let headerObserver = null;

  function createBuilderUI(controlsContainer) {
    try {
      if (!controlsContainer) { log('createBuilderUI called without controlsContainer'); return; }
      if (document.getElementById("hl_header--themebuilder-icon")) { log('themebuilder icon already exists'); return; }

      // Button (use emoji so no FA dependency)
      const btn = document.createElement("a");
      btn.href = "javascript:void(0);";
      btn.id = "hl_header--themebuilder-icon";
      btn.className = "btn";
      btn.style.cssText = `display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; background-color:#000; cursor:pointer; position:relative; border-radius:4px;`;
      btn.innerHTML = `<span style="font-size:18px; line-height:1;">🖌️</span>`;
      initTooltip(btn, "Theme Builder");
      // Append button to chosen controls container
      controlsContainer.appendChild(btn);
      log('button appended to controls container');

      // Drawer (only once)
      if (!document.getElementById('themeBuilderDrawer')) {
        const drawer = document.createElement("div");
        drawer.id = "themeBuilderDrawer";
        drawer.style.cssText = `position:fixed; top:0; right:-420px; width:400px; max-width:90%; height:100%; background:#fff; box-shadow:-2px 0 5px rgba(0,0,0,0.3); transition:right 0.28s ease; z-index:99999; padding:0; display:flex; flex-direction:column; overflow-y:auto;`;
        // header bar
        const headerBar = document.createElement('div');
        headerBar.style.cssText = 'display:flex; align-items:center; justify-content:center; position:relative; padding:14px 16px; border-bottom:1px solid #e6e6e6; background:#fafafa; font-weight:600;';
        const title = document.createElement('div');
        title.textContent = 'Theme Builder';
        title.style.cssText = 'font-size:16px; text-align:center; flex:1;';
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:22px; background:none; border:none; cursor:pointer; color:#333;';
        headerBar.appendChild(title);
        headerBar.appendChild(closeBtn);
        drawer.appendChild(headerBar);

        // content
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = 'padding:16px; flex:1;';
        drawer.appendChild(contentWrapper);

        // sections
        contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
        contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

        // append to body
        document.body.appendChild(drawer);

        // toggle handlers
        btn.addEventListener('click', () => { drawer.style.right = '0'; });
        closeBtn.addEventListener('click', () => { drawer.style.right = '-420px'; });

        // apply saved settings immediately
        applySavedSettings();
      } else {
        log('drawer already present');
      }
    } catch (err) {
      console.error('[ThemeBuilder] createBuilderUI error:', err);
    }
  }

  function applySavedSettings() {
    try {
      ["primaryColor", "primaryBgColor", "sidebarBgColor", "sidebarTextColor", "sidebarIconColor"].forEach((key) => {
        const val = localStorage.getItem(key);
        if (val) {
          const cssVar = "--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
          document.body.style.setProperty(cssVar, val);
        }
      });
      const savedRadius = localStorage.getItem("btnRadius");
      if (savedRadius) {
        document.querySelectorAll(".btn-theme").forEach((b) => { b.style.borderRadius = savedRadius + "px"; });
      }
    } catch (e) {
      log('applySavedSettings error', e);
    }
  }

  /* ================= Find correct controls container ================= */
  function findControlsContainer() {
    const header = document.querySelector('header.hl_header') || document.querySelector('header');
    if (!header) return null;
    const controls = header.querySelectorAll('.hl_header--controls');
    if (!controls || controls.length === 0) return null;
    // Prefer the controls container with the most child elements (likely the outer one)
    const sorted = Array.from(controls).sort((a, b) => b.childElementCount - a.childElementCount);
    return sorted[0];
  }

  /* ================= Initialization with retries + observer ================= */
  function initThemeBuilder(attempts = 0) {
    try {
      log('init attempt', attempts);
      const rlno = localStorage.getItem('rlno');
      if (!rlno) {
        log('rlno not yet available');
        if (attempts < MAX_ATTEMPTS) {
          return setTimeout(() => initThemeBuilder(attempts + 1), 200);
        } else {
          log('rlno not found after retries — aborting');
          return;
        }
      }

      if (!allowedKeys.includes(rlno)) {
        log('Unauthorized user (rlno):', rlno);
        return;
      }
      log('rlno OK');

      const controlsContainer = findControlsContainer();
      if (!controlsContainer) {
        log('controls container not found yet');
        if (attempts < MAX_ATTEMPTS) {
          return setTimeout(() => initThemeBuilder(attempts + 1), 200);
        } else {
          log('controls container not found after retries — aborting');
          return;
        }
      }

      // Build UI
      createBuilderUI(controlsContainer);

      // Ensure we re-create if header is mutated (SPA navigation)
      const headerEl = document.querySelector('header.hl_header') || document.querySelector('header');
      if (headerEl && !headerObserver) {
        headerObserver = new MutationObserver((mutations) => {
          // If header got replaced and our button disappeared, try to re-init quickly
          if (!document.getElementById('hl_header--themebuilder-icon')) {
            log('header mutated — themebuilder missing, re-initializing');
            setTimeout(() => initThemeBuilder(0), 200);
          }
        });
        headerObserver.observe(headerEl, { childList: true, subtree: true });
        log('header observer attached');
      }
    } catch (err) {
      console.error('[ThemeBuilder] init error:', err);
    }
  }

  /* ================= Start ================= */
  // try on DOMContentLoaded and immediately (covers both static and dynamic loads)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => initThemeBuilder(0), 50);
  });
  // immediate attempt as well
  setTimeout(() => initThemeBuilder(0), 50);

})();
