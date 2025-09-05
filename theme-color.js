(function () {
  window.ThemeBuilder = window.ThemeBuilder || {};

  window.ThemeBuilder.buildThemeColorSection = function (container) {
    var wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display:flex; align-items:center; gap:10px;
    `;

    var colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = localStorage.getItem("themeColor") || "#007bff";
    colorInput.style.cssText = `
      width:50px; height:40px; border:none; cursor:pointer;
    `;

    var colorCode = document.createElement("span");
    colorCode.textContent = colorInput.value;
    colorCode.style.cssText = `
      font-family:monospace; font-size:14px; cursor:pointer; color:#333;
      background:#f0f0f0; padding:5px 10px; border-radius:4px;
    `;

    // Copy to clipboard
    colorCode.addEventListener("click", function () {
      navigator.clipboard.writeText(colorCode.textContent).then(() => {
        colorCode.style.background = "#c8e6c9";
        setTimeout(() => { colorCode.style.background = "#f0f0f0"; }, 800);
      });
    });

    // Update theme
    colorInput.addEventListener("input", function () {
      var color = colorInput.value;
      colorCode.textContent = color;
      localStorage.setItem("themeColor", color);
      document.body.style.setProperty("--theme-color", color);
      document.querySelectorAll(".btn-theme").forEach(btn => {
        btn.style.backgroundColor = color;
      });
    });

    wrapper.appendChild(colorInput);
    wrapper.appendChild(colorCode);
    container.appendChild(wrapper);
  };
})();
