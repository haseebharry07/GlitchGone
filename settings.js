(function() {
  function addThemeBuilderBtn() {
    var controlsContainer = document.querySelector(".hl_header--controls");
    if (!controlsContainer) {
      setTimeout(addThemeBuilderBtn, 500);
      return;
    }

    // Prevent duplicates
    if (document.getElementById("hl_header--themebuilder-icon")) return;

    // Create Theme Builder button
    var btn = document.createElement("a");
    btn.href = "javascript:void(0);";
    btn.id = "hl_header--themebuilder-icon";
    btn.className = "btn"; // base btn class
    btn.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #000; /* black button */
      cursor: pointer;
      position: relative;
    `;

    // Add icon inside button (white)
    btn.innerHTML = `<i class="fa fa-paint-brush" style="color:#fff; font-size:18px;"></i>`;

    // Create tooltip element using existing class
    var tooltip = document.createElement("div");
    tooltip.className = "tooltip-inner";
    tooltip.textContent = "Theme Builder";
    tooltip.style.cssText = `
      position: absolute;
      top: 110%; /* below the button */
      left: 50%;
      transform: translateX(-50%);
      background-color: green;
      color: #fff;
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1000;
    `;
    btn.appendChild(tooltip);

    // Show tooltip on hover
    btn.addEventListener("mouseenter", function() {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
    });
    btn.addEventListener("mouseleave", function() {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    });

    // Append button to header controls
    controlsContainer.appendChild(btn);

    // Popup overlay (same as before)
    var popupOverlay = document.createElement("div");
    popupOverlay.id = "themeBuilderPopupOverlay";
    popupOverlay.style.cssText = `
      display:none; position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;
    `;

    var popupBox = document.createElement("div");
    popupBox.style.cssText = `
      background:#fff; padding:20px; border-radius:10px; width:400px; max-width:90%;
      text-align:center; position:relative;
    `;
    popupBox.innerHTML = `
      <h2 style="margin-bottom:15px;">Theme Builder</h2>
      <p>Here you can configure your theme options.</p>
      <button id="closeThemeBuilderPopup" style="margin-top:15px; padding:8px 16px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">
        Close
      </button>
    `;
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);

    // Show popup on button click
    btn.addEventListener("click", function() {
      popupOverlay.style.display = "flex";
    });

    // Close popup
    popupOverlay.addEventListener("click", function(e) {
      if (e.target.id === "closeThemeBuilderPopup" || e.target === popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });
  }

  // Initialize button
  addThemeBuilderBtn();
})();
