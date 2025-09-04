(function() {
  function storeRelNumber() {
    // Find the span with text "Relationship Number"
    var labelSpan = Array.from(document.querySelectorAll("span"))
      .find(span => span.textContent.trim() === "Relationship Number");

    if (labelSpan && labelSpan.nextElementSibling) {
      var relNumber = labelSpan.nextElementSibling.textContent.trim();
      localStorage.setItem("glitchgoneRelNumber", relNumber);
      console.log("✅ Relationship Number stored:", relNumber);
    } else {
      // Retry if the elements are not yet loaded
      setTimeout(storeRelNumber, 200);
    }
  }

  storeRelNumber();
})();
