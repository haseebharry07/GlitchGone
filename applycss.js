(function() {
  var allowedUsers = ["iamhaseeb01@outlook.com", "anotheruser@example.com"];

  function applyCSS() {
    var currentUserEmail = localStorage.getItem("glitchgoneUserEmail");
    if (!currentUserEmail) {
      // Retry until email is stored
      setTimeout(applyCSS, 200);
      return;
    }

    if (allowedUsers.includes(currentUserEmail)) {
      var base64Url = "https://glitch-gone.vercel.app/style-base64.txt";
      fetch(base64Url)
        .then(res => res.text())
        .then(encodedCSS => {
          var decodedCSS = atob(encodedCSS.trim());
          var style = document.createElement("style");
          style.innerHTML = decodedCSS;
          document.head.appendChild(style);
          console.log("✅ CSS applied for", currentUserEmail);
        })
        .catch(err => console.error("❌ Failed to load CSS", err));
    } else {
      console.log("❌ Unauthorized user:", currentUserEmail);
    }
  }

  applyCSS();
})();
