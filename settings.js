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
    transition:right 0.3s ease; z-index:9999; display:flex;
    flex-direction:column; overflow-y:auto;
  `;

  // 🔹 Drawer Header with Title & Cross Button
  const headerBar = document.createElement("div");
  headerBar.style.cssText = `
    display:flex; align-items:center; justify-content:center;
    background:#f5f5f5; padding:15px; position:relative; font-weight:bold;
    font-size:16px; border-bottom:1px solid #ddd;
  `;
  headerBar.textContent = "Theme Builder";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&times;"; // cross symbol
  closeBtn.style.cssText = `
    position:absolute; right:15px; top:50%; transform:translateY(-50%);
    background:none; border:none; font-size:24px; font-weight:bold;
    color:#333; cursor:pointer; line-height:1;
  `;
  headerBar.appendChild(closeBtn);
  drawer.appendChild(headerBar);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.cssText = "padding:20px; flex:1;";
  drawer.appendChild(contentWrapper);

  document.body.appendChild(drawer);

  // Add sections inside content wrapper
  contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
  contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

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
