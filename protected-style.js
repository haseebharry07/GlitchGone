(function() {
  try {
    const allowedRel = "0-373-489";
    const currentUrl = window.location.href;

    // STEP 1: Capture relationship number on Company Basic Details page
    if (currentUrl.includes("/settings/company") && !currentUrl.includes("tab=")) {
      const allSpans = document.querySelectorAll("span");
      for (const span of allSpans) {
        if (span.textContent.trim() === "Relationship Number") {
          const nextSibling = span.nextElementSibling;
          if (nextSibling) {
            const relationshipNumber = nextSibling.textContent.trim();
            console.log("✅ Captured relationship number:", relationshipNumber);
            localStorage.setItem("userRelationshipNumber", relationshipNumber);
            break;
          }
        }
      }
    }

    // STEP 2: On Whitelabel tab, validate and load CSS
    if (currentUrl.includes("tab=whitelabel")) {
      const storedRel = localStorage.getItem("userRelationshipNumber");

      if (storedRel && storedRel.startsWith(allowedRel)) {
        console.log("✅ Relationship number valid. Loading CSS...");

        // Fetch your Base64 CSS file
        var base64Url = "https://glitch-gone.vercel.app/style-base64.txt";
        fetch(base64Url)
          .then(res => res.text())
          .then(encodedCSS => {
            var decodedCSS = atob(encodedCSS.trim());
            var style = document.createElement("style");
            style.innerHTML = decodedCSS;
            document.head.appendChild(style);
            console.log("✅ CSS applied successfully.");
          })
          .catch(err => console.error("❌ Failed to load CSS file", err));
      } else {
        console.error("❌ Invalid relationship number. Please contact support.");
        alert("Error: Please contact support.");
      }
    }
  } catch (error) {
    console.error("Script error:", error.message);
  }
})();
