(function () {
  /* ... (all your utility functions stay the same) ... */

  const allowedKeys = [btoa("0-373-489")];

  function initThemeBuilder(attempts = 0) {
    const rlno = localStorage.getItem("rlno");
    if (!rlno) {
      if (attempts < 20) {
        setTimeout(() => initThemeBuilder(attempts + 1), 200);
      }
      return;
    }

    if (!allowedKeys.includes(rlno)) {
      console.log("❌ Unauthorized user, Theme Builder disabled");
      return;
    }

    const controlsContainer = document.querySelector("header.hl_header .hl_header--controls");
    if (!controlsContainer) {
      if (attempts < 20) {
        setTimeout(() => initThemeBuilder(attempts + 1), 200);
      }
      return;
    }

    if (document.getElementById("hl_header--themebuilder-icon")) return;

    // === Button ===
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

    // === Drawer ===
    const drawer = document.createElement("div");
    drawer.id = "themeBuilderDrawer";
    drawer.style.cssText = `
      position:fixed; top:0; right:-400px; width:400px; max-width:90%;
      height:100%; background:#fff; box-shadow:-2px 0 5px rgba(0,0,0,0.3);
      transition:right 0.3s ease; z-index:9999; padding:20px; display:flex;
      flex-direction:column; overflow-y:auto;
    `;

    const headerRow = document.createElement("div");
    headerRow.style.cssText = `
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:20px;
    `;

    const title = document.createElement("h2");
    title.textContent = "Theme Builder";
    title.style.cssText = "margin:0; font-size:18px; text-align:center; flex:1;";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
      font-size:24px; background:none; border:none; cursor:pointer; color:#333;
    `;

    headerRow.appendChild(title);
    headerRow.appendChild(closeBtn);
    drawer.appendChild(headerRow);
    document.body.appendChild(drawer);

    drawer.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
    drawer.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

    btn.addEventListener("click", () => (drawer.style.right = "0"));
    closeBtn.addEventListener("click", () => (drawer.style.right = "-400px"));

    // === Apply saved settings ===
    ["primaryColor", "primaryBgColor", "sidebarBgColor", "sidebarTextColor", "sidebarIconColor"].forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) {
        document.body.style.setProperty("--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), val);
      }
    });

    const savedRadius = localStorage.getItem("btnRadius");
    if (savedRadius) {
      document.querySelectorAll(".btn-theme").forEach((b) => {
        b.style.borderRadius = savedRadius + "px";
      });
    }
  }

  // Kick off
  initThemeBuilder();
})();
