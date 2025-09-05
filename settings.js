(function() {
  // Wait until DOM is ready
  document.addEventListener("DOMContentLoaded", function() {
    // Find the container where other buttons are (header controls area)
    var controlsContainer = document.querySelector(".hl_header--controls");

    if (!controlsContainer) return;

    // Create the Settings button
    var settingsBtn = document.createElement("a");
    settingsBtn.href = "javascript:void(0);";
    settingsBtn.id = "hl_header--settings-icon";
    settingsBtn.title = "Settings";
    settingsBtn.className = "btn btn-circle btn-primary hl_header--copy-link";
    settingsBtn.style.background = "rgb(52, 152, 219)"; // Blue background

    // Add icon inside button
    settingsBtn.innerHTML = '<i class="fa fa-cog" style="color:#fff;"></i><span class="sr-only">Settings</span>';

    // Append the button to the header controls
    controlsContainer.appendChild(settingsBtn);

    // Create popup overlay
    var popupOverlay = document.createElement("div");
    popupOverlay.id = "settingsPopupOverlay";
    popupOverlay.style.cssText = `
      display:none;
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.5);
      z-index:9999;
      justify-content:center;
      align-items:center;
    `;

    // Create popup box
    var popupBox = document.createElement("div");
    popupBox.style.cssText = `
      background:#fff;
      padding:20px;
      border-radius:10px;
      width:400px;
      max-width:90%;
      text-align:center;
      position:relative;
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

    // Open popup on button click
    settingsBtn.addEventListener("click", function() {
      popupOverlay.style.display = "flex";
    });

    // Close popup on close button click
    document.getElementById("closeSettingsPopup").addEventListener("click", function() {
      popupOverlay.style.display = "none";
    });

    // Close popup if user clicks outside the popup box
    popupOverlay.addEventListener("click", function(e) {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });
  });
})();
