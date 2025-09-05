(function() {
  function addSettingsBtn() {
    var controlsContainer = document.querySelector(".hl_header--controls");
    if (!controlsContainer) {
      setTimeout(addSettingsBtn, 500);
      return;
    }

    // Prevent duplicates
    if (document.getElementById("hl_header--settings-icon")) return;

    // Create Theme Builder button
    var settingsBtn = document.createElement("a");
    settingsBtn.href = "javascript:void(0);";
    settingsBtn.id = "hl_header--settings-icon";
    settingsBtn.className = "btn btn-circle btn-black"; // black button
    settingsBtn.style.position = "relative"; // for tooltip positioning
    settingsBtn.title = "Theme Builder"; // default tooltip

    // Add custom icon (you can replace with another icon if needed)
    settingsBtn.innerHTML = `
      <i class="fa fa-paint-brush" style="color:#fff;"></i>
    `;

    // Tooltip element
    var tooltip = document.createElement("span");
    tooltip.textContent = "Theme Builder";
    tooltip.style.cssText = `
      visibility: hidden;
      width: 120px;
      background-color: green;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      padding: 5px 0;
      position: absolute;
      z-index: 10000;
      bottom: 120%; /* above the button */
      left: 50%;
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 12px;
    `;
    settingsBtn.appendChild(tooltip);

    // Show tooltip on hover
    settingsBtn.addEventListener("mouseenter", function() {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
    });
    settingsBtn.addEventListener("mouseleave", function() {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    });

    // Append button to controls
    controlsContainer.appendChild(settingsBtn);

    // Create popup overlay
    var popupOverlay = document.createElement("div");
    popupOverlay.id = "settingsPopupOverlay";
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
      <button id="closeSettingsPopup" style="margin-top:15px; padding:8px 16px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">
        Close
      </button>
    `;
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);

    // Show popup
    settingsBtn.addEventListener("click", function() {
      popupOverlay.style.display = "flex";
    });

    // Close popup
    popupOverlay.addEventListener("click", function(e) {
      if (e.target.id === "closeSettingsPopup" || e.target === popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });
  }

  // Start loop until the element is found
  addSettingsBtn();
})();
