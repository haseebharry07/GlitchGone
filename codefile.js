(function() {
        function strrlno() { 
          var labelSpan = Array.from(document.querySelectorAll("span")) 
          .find(span => span.textContent.trim() === "Relationship Number"); 
          if (labelSpan && labelSpan.nextElementSibling) 
          { var rlNo = labelSpan.nextElementSibling.textContent.trim();
           localStorage.setItem("rlNo", rlNo); } else { 
             setTimeout(strrlno, 200); 
           } } 
  strrlno();
})();
