(function() {
    var allowedKeys = [btoa("0-373-489")]; // Allowed Relationship Numbers

    function initThemeBuilder() {
        var rlno = localStorage.getItem("rlno");

        if (!rlno) {
            setTimeout(initThemeBuilder, 200);
            return;
        }

        if (!allowedKeys.includes(rlno)) {
            console.log("❌ Unauthorized user, Theme Builder disabled");
            return;
        }

        var controlsContainer = document.querySelector(".hl_header--controls");
        if (!controlsContainer) {
            setTimeout(initThemeBuilder, 500);
            return;
        }

        if (document.getElementById("hl_header--themebuilder-icon")) return; // Prevent duplicates

        // --- Create Theme Builder Button ---
        var btn = document.createElement("a");
        btn.href = "javascript:void(0);";
        btn.id = "hl_header--themebuilder-icon";
        btn.className = "btn";
        btn.style.cssText = `
            display:inline-flex; align-items:center; justify-content:center;
            width:40px; height:40px; border-radius:50%; background-color:#000; cursor:pointer; position:relative;
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

        // --- Create Drawer ---
        var drawer = document.createElement("div");
        drawer.id = "themeBuilderDrawer";
        drawer.style.cssText = `
            position:fixed; top:0; right:-400px; width:400px; max-width:90%;
            height:100%; background:#fff; box-shadow:-2px 0 5px rgba(0,0,0,0.3);
            transition:right 0.3s ease; z-index:9999; padding:20px; display:flex;
            flex-direction:column;
        `;

        // Close button
        var closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.cssText = `
            align-self:flex-end; padding:8px 16px; background:#333; color:#fff;
            border:none; border-radius:5px; cursor:pointer; margin-bottom:20px;
        `;
        drawer.appendChild(closeBtn);

        // --- Vertical Accordion Section: Theme Color ---
        var section = document.createElement("div");
        section.style.cssText = `
            border:1px solid #ccc; border-radius:6px; margin-bottom:10px; overflow:hidden;
        `;

        var sectionHeader = document.createElement("div");
        sectionHeader.textContent = "🎨 Theme Color";
        sectionHeader.style.cssText = `
            padding:10px; background:#f5f5f5; cursor:pointer; font-weight:bold;
        `;
        section.appendChild(sectionHeader);

        var sectionContent = document.createElement("div");
        sectionContent.style.cssText = `
            display:none; padding:15px; background:#fff;
        `;

        // Color picker box
        var colorWrapper = document.createElement("div");
        colorWrapper.style.cssText = `
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

        // Copy to clipboard on click
        colorCode.addEventListener("click", function() {
            navigator.clipboard.writeText(colorCode.textContent).then(() => {
                colorCode.style.background = "#c8e6c9";
                setTimeout(() => { colorCode.style.background = "#f0f0f0"; }, 800);
            });
        });

        // Update theme on color change
        colorInput.addEventListener("input", function() {
            var color = colorInput.value;
            colorCode.textContent = color;
            localStorage.setItem("themeColor", color);
            document.body.style.setProperty("--theme-color", color);
            document.querySelectorAll(".btn-theme").forEach(btn => {
                btn.style.backgroundColor = color;
            });
        });

        colorWrapper.appendChild(colorInput);
        colorWrapper.appendChild(colorCode);
        sectionContent.appendChild(colorWrapper);
        section.appendChild(sectionContent);
        drawer.appendChild(section);

        // Accordion toggle
        sectionHeader.addEventListener("click", function() {
            var isOpen = sectionContent.style.display === "block";
            sectionContent.style.display = isOpen ? "none" : "block";
        });

        document.body.appendChild(drawer);

        // --- Open/Close drawer ---
        btn.addEventListener("click", function() {
            drawer.style.right = "0";
        });
        closeBtn.addEventListener("click", function() {
            drawer.style.right = "-400px";
        });

        // Apply saved theme on load
        var savedColor = localStorage.getItem("themeColor");
        if (savedColor) {
            document.body.style.setProperty("--theme-color", savedColor);
            document.querySelectorAll(".btn-theme").forEach(btn => {
                btn.style.backgroundColor = savedColor;
            });
        }
    }

    initThemeBuilder();
})();
