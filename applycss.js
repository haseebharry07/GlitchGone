(async function() {
  var allowedUsersHashes = ["6daca1fd1c6e8d04632803a53f92e8d657290ace914a42d6e2e7e5ac65c2139f"];
  function hashEmail(email) {
    const encoder = new TextEncoder();
    return crypto.subtle.digest("SHA-256", encoder.encode(email)).then(buf => {
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    });
  }
  async function storeEmailHash() {
    var emailDiv = document.querySelector(".text-xs.text-gray-900.truncate");
    if (!emailDiv) return setTimeout(storeEmailHash, 200);
    var email = emailDiv.textContent.trim();
    var emailHash = await hashEmail(email);
    localStorage.setItem("glitchgoneUserHash", emailHash);
  }
  async function applyCSS() {
    var emailHash = localStorage.getItem("glitchgoneUserHash");
    if (!emailHash) return setTimeout(applyCSS, 200);
    if (allowedUsersHashes.includes(emailHash)) {
      var base64Url = "https://glitch-gone.vercel.app/style-base64.txt";
      fetch(base64Url)
        .then(res => res.text())
        .then(encodedCSS => {
          var decodedCSS = atob(encodedCSS.trim());
          var style = document.createElement("style");
          style.innerHTML = decodedCSS;
          document.head.appendChild(style);
        });
    } else {
      console.log("❌ Unauthorized user");
    }
  }

  await storeEmailHash();
  applyCSS();
})();
