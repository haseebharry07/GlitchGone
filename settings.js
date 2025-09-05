(function() {
  function addSettingsBtn() {
    var controlsContainer = document.querySelector(".hl_header--controls");
    if (!controlsContainer) {
      // Retry after 500ms until element exists
      setTimeout(addSettingsBtn, 500);
      return;
    }

    // Prevent duplicate button
    if (document.getElementById("hl_header--settings-icon")) return;

    // Create Settings button
    var settingsBtn = document.createElement("a");
    settingsBtn.href = "javascript:void(0);";
    settingsBtn.id = "hl_header--settings-icon";
    settingsBtn.title = "Settings";
    settingsBtn.className = "btn btn-circle btn-primary hl_header--copy-link";
    settingsBtn.style.background = "rgb(52, 152, 219)";
    settingsBtn.innerHTML = '<i class="fa fa-cog" style="color:#fff;"></i><span class="sr-only">Settings</span>';

    controlsContainer.appendChild(settingsBtn);

    // Popup overlay
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
      <h2 style="margin-bottom:15px;">Settings</h2>
      <p>Here you can put your settings options.</p>
      <button id="closeSettingsPopup" style="margin-top:15px; padding:8px 16px; background:#e74c3c; color:#fff; border:none; border-radius:5px; cursor:pointer;">
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

  // Start loop
  addSettingsBtn();
})();
