(function () {
  const DEBUG = true;
  const log = (...args) => { if (DEBUG) console.log('[ThemeBuilder]', ...args); };

  /* ================= Config ================= */
  const allowedKeys = [btoa("0-373-489")]; // base64 allowed rlno
  const MAX_ATTEMPTS = 40; // retry ~8s

  /* ================= Load CSS ================= */
  function loadThemeBuilderCSS() {
    if (!document.getElementById('themeBuilderCSS')) {
      const link = document.createElement('link');
      link.id = 'themeBuilderCSS';
      link.rel = 'stylesheet';
      link.href = 'https://glitch-gone.vercel.app/theme-builder.css';
      document.head.appendChild(link);
      log('ThemeBuilder CSS loaded');
    }
  }
  loadThemeBuilderCSS();

  /* ================= Utilities ================= */
  function createSection(title, contentBuilder) {
    const section = document.createElement("div");
    section.style.cssText = 'border:1px solid #ccc; border-radius:6px; margin-bottom:10px; overflow:hidden;';
    const header = document.createElement("div");
    header.textContent = title;
    header.style.cssText = 'padding:10px; background:#f5f5f5; cursor:pointer; font-weight:bold;';
    const content = document.createElement("div");
    content.style.cssText = 'display:none; padding:15px; background:#fff;';
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
    btn.appendChild(tooltip);
    btn.addEventListener("mouseenter", () => tooltip.style.opacity = tooltip.style.visibility = 'visible');
    btn.addEventListener("mouseleave", () => tooltip.style.opacity = tooltip.style.visibility = 'hidden');
  }

  /* ================= Color Picker ================= */
  function createColorPicker(labelText, storageKey, cssVar) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = 'display:flex; align-items:center; gap:10px; margin-bottom:10px;';
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.cssText = 'min-width:150px; font-weight:bold;';
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = localStorage.getItem(storageKey) || "#007bff";
    colorInput.style.cssText = 'width:50px; height:40px; border:none; cursor:pointer;';
    const colorCode = document.createElement("span");
    colorCode.textContent = colorInput.value;
    colorCode.style.cssText = 'font-family:monospace; font-size:14px; cursor:pointer; color:#333; background:#f0f0f0; padding:5px 10px; border-radius:4px;';
    colorCode.addEventListener("click", () => {
      navigator.clipboard.writeText(colorCode.textContent);
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
    container.appendChild(info);
    const controlRow = document.createElement("div");
    const radiusLabel = document.createElement("label");
    radiusLabel.textContent = "Radius:";
    const radiusInput = document.createElement("input");
    radiusInput.type = "range";
    radiusInput.min = 0;
    radiusInput.max = 50;
    radiusInput.value = localStorage.getItem("btnRadius") || 8;
    const radiusVal = document.createElement("span");
    radiusVal.textContent = radiusInput.value + "px";
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

    // Theme Builder button
    const btn = document.createElement("a");
    btn.href = "javascript:void(0);";
    btn.id = "hl_header--themebuilder-icon";
    btn.className = "btn";
    btn.innerHTML = '<span style="font-size:18px;">🖌️</span>';
    initTooltip(btn, "Theme Builder");
    controlsContainer.appendChild(btn);

    // Drawer
    if (!document.getElementById("themeBuilderDrawer")) {
      const drawer = document.createElement("div");
      drawer.id = "themeBuilderDrawer";

      // Drawer header
      const headerBar = document.createElement("div");
      const title = document.createElement("div");
      title.textContent = "Theme Builder";
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      headerBar.appendChild(title);
      headerBar.appendChild(closeBtn);
      drawer.appendChild(headerBar);

      // Drawer content
      const contentWrapper = document.createElement("div");
      contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
      contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));
      drawer.appendChild(contentWrapper);

      document.body.appendChild(drawer);

      // toggle drawer
      btn.addEventListener("click", () => drawer.style.right = "0");
      closeBtn.addEventListener("click", () => drawer.style.right = "-420px");

      applySavedSettings();
    }
  }

  function applySavedSettings() {
    ["primaryColor","primaryBgColor","sidebarBgColor","sidebarTextColor","sidebarIconColor"].forEach(key=>{
      const val = localStorage.getItem(key);
      if(val) document.body.style.setProperty('--'+key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()), val);
    });
    const savedRadius = localStorage.getItem("btnRadius");
    if(savedRadius) document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = savedRadius+"px");
  }

  function findControlsContainer() {
    const header = document.querySelector('header.hl_header') || document.querySelector('header');
    if (!header) return null;
    const controls = header.querySelectorAll('.hl_header--controls');
    if (!controls || controls.length===0) return null;
    return Array.from(controls).sort((a,b)=>b.childElementCount-a.childElementCount)[0];
  }

  function initThemeBuilder(attempts=0) {
    const rlno = localStorage.getItem('rlno');
    if (!rlno) {
      if (attempts < MAX_ATTEMPTS) return setTimeout(()=>initThemeBuilder(attempts+1),200);
      return;
    }
    if (!allowedKeys.includes(rlno)) return;

    const controlsContainer = findControlsContainer();
    if (!controlsContainer) {
      if (attempts < MAX_ATTEMPTS) return setTimeout(()=>initThemeBuilder(attempts+1),200);
      return;
    }

    createBuilderUI(controlsContainer);

    // observe header changes (SPA)
    const headerEl = document.querySelector('header.hl_header') || document.querySelector('header');
    if (headerEl && !headerObserver) {
      headerObserver = new MutationObserver(() => {
        if (!document.getElementById('hl_header--themebuilder-icon')) initThemeBuilder(0);
      });
      headerObserver.observe(headerEl,{childList:true,subtree:true});
    }
  }

  // Init
