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
})();
