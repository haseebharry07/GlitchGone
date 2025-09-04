(async function() {
  // Precomputed SHA-256 hashes of allowed relationship numbers
  const allowedHashes = ["6165cb3aec21bf7829219d2026675eb76a15f9c029da1b49f28cd3cba6a283a1"];
  function applyCSS() {
    const storedHash = localStorage.getItem("glitchgoneRelHash");
    if (!storedHash) {
      setTimeout(applyCSS, 200); // Retry until hash is available
      return;
    }
    if (allowedHashes.includes(storedHash)) {
      const base64Url = "https://glitch-gone.vercel.app/style-base64.txt";
      fetch(base64Url)
        .then(res => res.text())
        .then(encodedCSS => {
          const decodedCSS = atob(encodedCSS.trim());
          const style = document.createElement("style");
          style.innerHTML = decodedCSS;
          document.head.appendChild(style);
        })
        .catch(err => console.error("❌ Failed to load CSS", err));
    } else {
      console.log("❌ Unauthorized Relationship Number");
    }
  }

  applyCSS();
})();
