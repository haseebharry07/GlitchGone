(async function() {
  async function hashRelNumber(relNumber) {
    const encoder = new TextEncoder();
    const data = encoder.encode(relNumber);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getRelNumberFromDOM() {
    const labelSpan = Array.from(document.querySelectorAll("span"))
      .find(span => span.textContent.trim() === "Relationship Number");
    if (labelSpan && labelSpan.nextElementSibling) {
      return labelSpan.nextElementSibling.textContent.trim();
    }
    return null;
  }

  async function storeHashedRelNumber() {
    const relNumber = getRelNumberFromDOM();
    if (!relNumber) {
      setTimeout(storeHashedRelNumber, 200); // Retry until DOM loads
      return;
    }
    const hashed = await hashRelNumber(relNumber);
    localStorage.setItem("glitchgoneRelHash", hashed);
    console.log("✅");
  }

  storeHashedRelNumber();
})();
