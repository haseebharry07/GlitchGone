(function() {
  function storeEmail() {
    var emailDiv = document.querySelector(".text-xs.text-gray-900.truncate");
    if (emailDiv) {
      var email = emailDiv.textContent.trim();
      localStorage.setItem("glitchgoneUserEmail", email);
      console.log("✅ Email stored:", email);
    } else {
      // Retry until the email appears
      setTimeout(storeEmail, 200);
    }
  }

  storeEmail();
})();
