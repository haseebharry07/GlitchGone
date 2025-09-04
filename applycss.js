(function() {


  function storeEmail() {
    var emailDiv = document.querySelector(".text-xs.text-gray-900.truncate");
    if (emailDiv) {
      var email = emailDiv.textContent.trim();
      localStorage.setItem("glitchgoneUserEmail", btoa(email)); // store as Base64
      console.log("✅ Email stored (Base64)");
    } else {
      // Retry until the email appears
      setTimeout(storeEmail, 200);
    }
  }

  storeEmail();
  
  var allowedUsers = ["iamhaseeb01@outlook.com", "anotheruser@example.com"];

  function getDecodedEmail() {
    var encodedEmail = localStorage.getItem("glitchgoneUserEmail");
    if (!encodedEmail) return null;
    try {
      return atob(encodedEmail); // decode Base64
    } catch (e) {
      console.error("❌ Failed to decode email", e);
      return null;
    }
  }

  function applyCSS() {
    var currentUserEmail = getDecodedEmail();

    if (!currentUserEmail) {
      setTimeout(applyCSS, 200); // retry until email is available
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
