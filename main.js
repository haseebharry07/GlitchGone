(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    try {
      await loadScript("https://glitch-gone.vercel.app/theme-color.js");
      await loadScript("https://glitch-gone.vercel.app/button-style.js");
      console.log("✅ All theme builder scripts loaded");
    } catch (err) {
      console.error("❌ Failed to load a script", err);
    }
  }

  init();
})();
