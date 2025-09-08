(function () {
    const DEBUG = true;
    const log = (...args) => { if (DEBUG) console.log('[ThemeBuilder]', ...args); };

    const allowedKeys = [btoa("0-373-489")]; // example allowed keys
    const MAX_ATTEMPTS = 40;

    // --- Load CSS ---
    function loadThemeBuilderCSS() {
        if (!document.getElementById('themeBuilderCSS')) {
            const link = document.createElement('link');
            link.id = 'themeBuilderCSS';
            link.rel = 'stylesheet';
            link.href = 'https://glitch-gone.vercel.app/theme-builder.css';
            document.head.appendChild(link);
            log('CSS loaded');
        }
    }
    loadThemeBuilderCSS();

    // --- Sidebar colors ---
    function applySidebarColors(textColor, hoverColor) {
        let textStyle = document.getElementById("tb-sidebar-text-style");
        let hoverStyle = document.getElementById("tb-sidebar-hover-style");

        if (!textStyle) {
            textStyle = document.createElement("style");
            textStyle.id = "tb-sidebar-text-style";
            document.head.appendChild(textStyle);
        }

        if (!hoverStyle) {
            hoverStyle = document.createElement("style");
            hoverStyle.id = "tb-sidebar-hover-style";
            document.head.appendChild(hoverStyle);
        }

        // Tabs text color
        textStyle.innerHTML = `
            #sidebar-v2 a,
            #sidebar-v2 a span {
                color: ${textColor} !important;
            }
        `;

        // Tabs hover color
        hoverStyle.innerHTML = `
            #sidebar-v2 a:hover,
            #sidebar-v2 a:hover span,
            #sidebar-v2 a:focus,
            #sidebar-v2 a:focus span {
                color: ${hoverColor} !important;
                opacity: 1 !important;
            }
        `;
    }

    function initSidebarColors() {
        const textColor = localStorage.getItem("sidebarTextColor") || "#3c6590";
        const hoverColor = localStorage.getItem("sidebarIconColor") || "#007bff";
        applySidebarColors(textColor, hoverColor);
    }

    // --- Color Picker ---
    function createColorPicker(labelText, storageKey, cssVar, applyFn) {
        const wrapper = document.createElement("div");
        wrapper.className = "tb-color-picker-wrapper";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.className = "tb-color-picker-label";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = localStorage.getItem(storageKey) || "#007bff";
        colorInput.className = "tb-color-input";

        const colorCode = document.createElement("span");
        colorCode.className = "tb-color-code";
        colorCode.textContent = colorInput.value;

        // Copy color code on click
        colorCode.addEventListener("click", () => {
            navigator.clipboard.writeText(colorCode.textContent).then(() => {
                colorCode.style.background = "#c8e6c9";
                setTimeout(() => (colorCode.style.background = "#f0f0f0"), 800);
            });
        });

        colorInput.addEventListener("input", () => {
            const color = colorInput.value;
            colorCode.textContent = color;
            localStorage.setItem(storageKey, color);
            if (cssVar) document.body.style.setProperty(cssVar, color);
            if (applyFn) applyFn(color); // apply live
        });

        wrapper.appendChild(label);
        wrapper.appendChild(colorInput);
        wrapper.appendChild(colorCode);
        return wrapper;
    }

    // --- Sections ---
    function createSection(title, contentBuilder) {
        const section = document.createElement("div");
        section.className = "tb-section";

        const header = document.createElement("div");
        header.className = "tb-section-header";
        header.textContent = title;

        const content = document.createElement("div");
        content.className = "tb-section-content";

        header.addEventListener("click", () => {
            content.classList.toggle("open");
        });

        section.appendChild(header);
        section.appendChild(content);
        contentBuilder(content);
        return section;
    }

    function buildThemeColorsSection(container) {
        const colors = [
            { label: "Choose Primary Color", key: "primaryColor", var: "--primary-color" },
            { label: "Choose Primary BG Color", key: "primaryBgColor", var: "--primary-bg-color" },
            { label: "Left Sidebar BG Color", key: "sidebarBgColor", var: "--sidebar-bg-color" },
            { label: "Left Sidebar Tabs Color", key: "sidebarTextColor", var: null, apply: initSidebarColors },
            { label: "Left Sidebar Tabs Hover Color", key: "sidebarIconColor", var: null, apply: initSidebarColors },
        ];
        colors.forEach(c => container.appendChild(createColorPicker(c.label, c.key, c.var, c.apply)));
    }

    function buildButtonStyleSection(container) {
        const wrapper = document.createElement("div");

        const label = document.createElement("label");
        label.textContent = "Button Border Radius";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.value = localStorage.getItem("btnRadius") || 4;
        wrapper.appendChild(input);

        input.addEventListener("input", () => {
            const val = input.value;
            localStorage.setItem("btnRadius", val);
            document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = val + "px");
        });

        container.appendChild(wrapper);
    }

    // --- Saved settings ---
    function applySavedSettings() {
        // Theme colors
        ["primaryColor", "primaryBgColor", "sidebarBgColor"].forEach(key => {
            const val = localStorage.getItem(key);
            if (val) document.body.style.setProperty(`--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, val);
        });
        // Sidebar colors
        initSidebarColors();

        // Button radius
        const savedRadius = localStorage.getItem("btnRadius");
        if (savedRadius) {
            document.querySelectorAll(".btn-theme").forEach(b => b.style.borderRadius = savedRadius + "px");
        }
    }

    // --- Build Drawer UI ---
    function createBuilderUI(controlsContainer) {
        if (!controlsContainer || document.getElementById("hl_header--themebuilder-icon")) return;

        const btn = document.createElement("a");
        btn.href = "javascript:void(0);";
        btn.id = "hl_header--themebuilder-icon";
        btn.className = "tb-btn-icon";
        btn.innerHTML = `<span style="font-size:18px;">🖌️</span>`;
        controlsContainer.appendChild(btn);

        if (!document.getElementById('themeBuilderDrawer')) {
            const drawer = document.createElement("div");
            drawer.id = "themeBuilderDrawer";
            drawer.className = "tb-drawer";

            const headerBar = document.createElement('div');
            headerBar.className = "tb-drawer-header";

            const title = document.createElement('div');
            title.textContent = 'Theme Builder';
            title.className = "tb-drawer-title";

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.className = "tb-drawer-close";

            headerBar.appendChild(title);
            headerBar.appendChild(closeBtn);
            drawer.appendChild(headerBar);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = "tb-drawer-content";
            drawer.appendChild(contentWrapper);

            contentWrapper.appendChild(createSection("🎨 Theme Colors", buildThemeColorsSection));
            contentWrapper.appendChild(createSection("🔘 Button Style", buildButtonStyleSection));

            document.body.appendChild(drawer);

            btn.addEventListener('click', () => drawer.classList.add('open'));
            closeBtn.addEventListener('click', () => drawer.classList.remove('open'));

            applySavedSettings();
        }
    }

    // --- Helpers ---
    function findControlsContainer() {
        const header = document.querySelector('header.hl_header') || document.querySelector('header');
        if (!header) return null;
        const controls = header.querySelectorAll('.hl_header--controls');
        if (!controls.length) return null;
        return Array.from(controls).sort((a, b) => b.childElementCount - a.childElementCount)[0];
    }

    function initThemeBuilder(attempts = 0) {
        const rlno = localStorage.getItem('rlno');
        if (!rlno) {
            if (attempts < MAX_ATTEMPTS) setTimeout(() => initThemeBuilder(attempts + 1), 200);
            return;
        }
        if (!allowedKeys.includes(rlno)) return;

        const controlsContainer = findControlsContainer();
        if (!controlsContainer) {
            if (attempts < MAX_ATTEMPTS) setTimeout(() => initThemeBuilder(attempts + 1), 200);
            return;
        }

        createBuilderUI(controlsContainer);

        const headerEl = document.querySelector('header.hl_header') || document.querySelector('header');
        if (headerEl && !window.headerObserver) {
            window.headerObserver = new MutationObserver(() => {
                if (!document.getElementById('hl_header--themebuilder-icon')) setTimeout(() => initThemeBuilder(0), 200);
            });
            window.headerObserver.observe(headerEl, { childList: true, subtree: true });
        }
    }

    document.addEventListener('DOMContentLoaded', () => setTimeout(() => initThemeBuilder(0), 50));
    setTimeout(() => initThemeBuilder(0), 50);
})();
