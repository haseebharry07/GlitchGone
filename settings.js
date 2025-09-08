(function () {
  /* ================= Utilities ================= */
  function createSection(title, contentBuilder) {
    const section = document.createElement("div");
    section.style.cssText = `
      border:1px solid #ccc; border-radius:6px; margin-bottom:10px; overflow:hidden;
    `;

    const header = document.createElement("div");
    header.textContent = title;
    header.style.cssText = `
      padding:10px; background:#f5f5f5; cursor:pointer; font-weight:bold;
    `;
    section.appendChild(header);

    const content = document.createElement("div");
    content.style.cssText = `display:none; padding:15px; background:#fff;`;
    section.appendChild(content);

    header.addEventListener("click", () => {
      const isOpen = content.style.display === "block";
      content.style.display = isOpen ? "none" : "block";
    });

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
      transition:opacity 0.3s; z-index:1000;
    `;
    btn.appendChild(tooltip);

    btn.addEventListener("mouseenter", () => {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
    });
    btn.addEventListener("mouseleave", () => {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    });
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
    colorCode.style.cssText = `
      font-family:monospace; font-size:14px; cursor:pointer; color:#333;
      background:#f0f0f0; padding:5px 10px; border-radius:4px;
    `;

    // Copy to clipboard
    colorCode.addEventListener("click", () => {
      navigator.clipboard.writeText(colorCode.textContent).then(() => {
        colorCode.style.background = "#c8e6c9";
        setTimeout(() => (colorCode.style.background = "#f0f0f0"), 800);
      });
    });

    // Update color
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

  /* ============ Theme Colors Section ============ */
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

  /* ================= Button Style Section ================= */
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
    radiusInput.type = "range";
    radiusInput.min = "0";
    radiusInput.max = "50";
    radiusInput.value = localStorage.getItem("btnRadius") || 8;

    const radiusVal = document.createElement("span");
    radiusVal.textContent = radiusInput.value + "px";
    radiusVal.style.cssText = "font-family:monospace;";

    controlRow.appendChild(radiusLabel);
    controlRow.appendChild(radiusInput);
    controlRow.appendChild(radiusVal);
    container.appendChild(controlRow);

    const sample = document.createElement("button");
    sample.textContent = "Sample Button";
    sample.className = "btn-theme";
    sample.style.cssText = `
      padding:10px 20px; border:none; border-radius:${radiusInput.value}px;
      background-color: var(--primary-color, #007bff); color:#fff; cursor:pointer;
    `;
    container.appendChild(sample);

    radiusInput.addEventListener("input", () => {
      const v = radiusInput.value;
      radiusVal.textContent = v + "px";
      localStorage.setItem("btnRadius", v);
      sample.style.borderRadius = v + "px";
      document.querySelectorAll(".btn-theme").forEach((b) => {
        b.style.borderRadius = v + "px";
      });
    });
  }

  /* ================= Main Init ================= */
  const allowedKeys = [btoa("0-373-489")];

  function initThemeBuilder() {
    const rlno = localStorage.getItem("rlno");
    if (!rlno) {
      setTimeout(initThemeBuilder, 200);
      return;
    }

    if (!allowedKeys.includes(rlno)) {
      console.log("❌ Unauthorized user, Theme Builder disabled");
      return;
    }

    const controlsContainer = document.querySelector(".hl_header--controls");
    if (!controlsContainer) {
      setTimeout(initThemeBuilder, 500);
      return;
    }

    if (document.getElementById("hl_header--themebuilder-icon")) return;

    const btn = document.createElement("a");
    btn.href = "javascript:void(0);";
    btn.id = "hl_header--themebuilder-icon";
    btn.className = "btn";
    btn.style.cssText = `
      display:inline-flex; align-items:center; justify-content:center;
      width:32px; height:32px; background-color:#000; cursor:pointer; position:relative;
    `;
    btn.innerHTML = `<i class="fa fa-paint-brush" style="color:#fff; font-size:18px;"></i>`;
    initTooltip(btn, "Theme Builder");
    controlsContainer.appendChild(btn);

    const drawer = document.createElement("div");
    drawer.id = "themeBuilderDrawer";
    drawer.style.cssText = `
      position:fixed; top:0; right:-400px; width:400px; max-width:90%;
      height:100%; background:#fff; box-shadow:-2px 0 5px rgba(0,0,0,0.3);
      transition:right 0.3s ease; z-index:9999; padding:20px; display:flex;
      flex-direction:column; overflow-y:auto;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.cssText = `
      align-self:flex-end; padding:8px 16px; background:#333; color:#fff;
      border:none; border-radius:5px; cursor:pointer; margin-bottom:20px;
    `;
    drawer.appendChild(closeBtn);
    document.body.appendChild(drawer);

    // Add sections
    drawer.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
    drawer.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

    btn.addEventListener("click", () => (drawer.style.right = "0"));
    closeBtn.addEventListener("click", () => (drawer.style.right = "-400px"));

    // Apply saved colors
    ["primaryColor", "primaryBgColor", "sidebarBgColor", "sidebarTextColor", "sidebarIconColor"].forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) document.body.style.setProperty("--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), val);
    });

    const savedRadius = localStorage.getItem("btnRadius");
    if (savedRadius) {
      document.querySelectorAll(".btn-theme").forEach((b) => {
        b.style.borderRadius = savedRadius + "px";
      });
    }
  }

  initThemeBuilder();
})();
