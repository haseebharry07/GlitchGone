(function () {
  window.ThemeBuilder = window.ThemeBuilder || {};

  window.ThemeBuilder.buildButtonStyleSection = function (container) {
    var info = document.createElement("p");
    info.textContent = "Here you can configure button styles (demo).";
    info.style.cssText = "margin:0 0 10px 0; font-size:14px;";

    var btn = document.createElement("button");
    btn.textContent = "Sample Button";
    btn.className = "btn-theme";
    btn.style.cssText = `
      padding:10px 20px; border:none; border-radius:6px;
      background-color: var(--theme-color, #007bff); color:#fff;
      cursor:pointer;
    `;

    container.appendChild(info);
    container.appendChild(btn);
  };
})();
