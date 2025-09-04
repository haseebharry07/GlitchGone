(function() {
  var allowedRelNumbers = ["0-373-489", "1-234-567"]; // Allowed Relationship Numbers

  function applyCSS() {
    var relNumber = localStorage.getItem("glitchgoneRelNumber");
    if (!relNumber) {
      // Retry if Relationship Number not available yet
      setTimeout(applyCSS, 200);
      return;
    }

    if (allowedRelNumbers.includes(relNumber)) {
      var base64Url = "https://glitch-gone.vercel.app/style-base64.txt";
      fetch(base64Url)
        .then(res => res.text())
        .then(encodedCSS => {
          var decodedCSS = atob(encodedCSS.trim());
          var style = document.createElement("style");
          style.innerHTML = decodedCSS;
          document.head.appendChild(style);
          console.log("✅ CSS applied for Relationship Number:", relNumber);
        })
        .catch(err => console.error("❌ Failed to load CSS", err));
    } else {
      console.log("❌ Unauthorized Relationship Number:", relNumber);
    }
  }

  applyCSS();
})();
