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
            border:none; border-radius:5px; cursor:pointer; margin-bottom:10px;
        `;
        drawer.appendChild(closeBtn);

        // --- Tabs ---
        var tabsContainer = document.createElement("div");
        tabsContainer.style.cssText = `
            display:flex; border-bottom:1px solid #ccc; margin-bottom:10px;
        `;

        var tab1 = document.createElement("div");
        tab1.textContent = "Theme Color";
        tab1.style.cssText = `
            padding:8px 12px; cursor:pointer; border-bottom:2px solid #000; margin-right:10px;
        `;
        var tab2 = document.createElement("div");
        tab2.textContent = "Other Tab";
        tab2.style.cssText = `
            padding:8px 12px; cursor:pointer; border-bottom:2px solid transparent;
        `;

        tabsContainer.appendChild(tab1);
        tabsContainer.appendChild(tab2);
        drawer.appendChild(tabsContainer);

        // --- Tab contents ---
        var tabContent1 = document.createElement("div");
        tabContent1.style.cssText = "display:block;";

        // Color picker inside first tab
        var colorLabel = document.createElement("label");
        colorLabel.textContent = "Pick Website Theme Color:";
        colorLabel.style.display = "block";
        colorLabel.style.marginBottom = "5px";

        var colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = localStorage.getItem("themeColor") || "#007bff"; // default color
        colorInput.style.width = "100%";
        colorInput.style.height = "40px";
        colorInput.style.border = "none";
        colorInput.style.cursor = "pointer";

        tabContent1.appendChild(colorLabel);
        tabContent1.appendChild(colorInput);
        drawer.appendChild(tabContent1);

        var tabContent2 = document.createElement("div");
        tabContent2.style.cssText = "display:none;";
        tabContent2.textContent = "This is the second tab content.";
        drawer.appendChild(tabContent2);

        // --- Tab switching logic ---
        tab1.addEventListener("click", function() {
            tabContent1.style.display = "block";
            tabContent2.style.display = "none";
            tab1.style.borderBottom = "2px solid #000";
            tab2.style.borderBottom = "2px solid transparent";
        });
        tab2.addEventListener("click", function() {
            tabContent1.style.display = "none";
            tabContent2.style.display = "block";
            tab2.style.borderBottom = "2px solid #000";
            tab1.style.borderBottom = "2px solid transparent";
        });

        // --- Live color change ---
        colorInput.addEventListener("input", function() {
            var color = colorInput.value;
            localStorage.setItem("themeColor", color);
            document.body.style.setProperty("--theme-color", color);
            // Example: change all buttons with class .btn-theme
            document.querySelectorAll(".btn-theme").forEach(btn => {
                btn.style.backgroundColor = color;
            });
        });

        document.body.appendChild(drawer);

        // --- Open/Close drawer ---
        btn.addEventListener("click", function() {
            drawer.style.right = "0";
        });
        closeBtn.addEventListener("click", function() {
            drawer.style.right = "-400px";
        });

        // --- Apply saved theme color on page load ---
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
