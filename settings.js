(function() {
    var allowedKeys = [btoa("0-373-489")]; // Allowed Relationship Numbers (Base64 encoded)

    function initThemeBuilder() {
        var rlno = localStorage.getItem("rlno");

        if (!rlno) {
            // Retry until rlno is available
            setTimeout(initThemeBuilder, 200);
            return;
        }

        // Only proceed if rlno is allowed
        if (!allowedKeys.includes(rlno)) {
            console.log("❌ Unauthorized user, Theme Builder disabled");
            return;
        }

        // --- Add Theme Builder Button & Popup ---
        var controlsContainer = document.querySelector(".hl_header--controls");
        if (!controlsContainer) {
            setTimeout(initThemeBuilder, 500);
            return;
        }

        if (document.getElementById("hl_header--themebuilder-icon")) return; // Prevent duplicates

        // Create Button
        var btn = document.createElement("a");
        btn.href = "javascript:void(0);";
        btn.id = "hl_header--themebuilder-icon";
        btn.className = "btn";
        btn.style.cssText = `
            display:inline-flex; align-items:center; justify-content:center;
            width:32px; height:32px; background-color:#000; cursor:pointer; position:relative;
        `;
        btn.innerHTML = `<i class="fa fa-paint-brush" style="color:#fff; font-size:18px;"></i>`;

        // Tooltip
        var tooltip = document.createElement("div");
        tooltip.className = "tooltip-inner";
        tooltip.textContent = "Theme Builder";
        tooltip.style.cssText = `
            position:absolute; top:110%; left:50%; transform:translateX(-50%);
            background-color:green; color:#fff; padding:5px 8px; border-radius:4px;
            font-size:12px; white-space:nowrap; visibility:hidden; opacity:0;
            transition:opacity 0.3s; z-index:1000;
        `;
        btn.appendChild(tooltip);

        btn.addEventListener("mouseenter", function() {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        });
        btn.addEventListener("mouseleave", function() {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        });

        controlsContainer.appendChild(btn);

        // Popup
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

        // Show popup on click
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

    // Initialize
    initThemeBuilder();
})();
