(function () {
    "use strict";

  var remainingAttempts = 10;

  function waitForAndCallHandlerFunction(url) {
    
  alert("IN waitForAndCallHandlerFunction");
      if (typeof window.handleOpenURL == "function") {
   
  alert("IN window.handleOpenUR");
          window.handleOpenURL(url);
    } else if (remainingAttempts-- > 0) {
      setTimeout(function(){waitForAndCallHandlerFunction(url)}, 500);
    }
  }

  function triggerOpenURL() {
   alert("IN triggerOpenURL");
      cordova.exec(
        waitForAndCallHandlerFunction,
        function(err) {alert("ERROR:"+err)},
        "UversePlugin",
        "checkIntent",
        []);
  }

})