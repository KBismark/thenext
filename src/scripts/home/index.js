//<
import "../../breaker";
("Everything inside this custom comment tags are ignored");
//>

!(function () {
  Breaker.pathname = "/module/home/index.js";
  Breaker.include("/module/home/app.js");
  Breaker.onload = function () {
    Breaker.ui.createApp(
      "/",
      Breaker.import.from("/module/home/app.js").App.getInstanceRef(),
      function () {},
      typeof window == "undefined" ? null : document.getElementById("page")
    );
  };
})();