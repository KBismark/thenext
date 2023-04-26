//<
import "../../breaker";
//>

/*
Copyright (c) 2023.
Bismark Yamoah

This file contains some general components used accross several pages
*/

!(function () {
  Breaker.pathname = "/module/components/global.js";

  const { createComponent } = Breaker.ui;

  function Button() {
    return (
      <view>
        <button
          key="main"
          class="cursor deep-back-hover deep-border-hover"
          style="border-radius:10px;padding:9px;color:#ffffff;text-align:center;display:block;width:100%;font-size:17px;"
        >
          <>{args.title}</>
        </button>
      </view>
    );
  }

  //Export components
  Breaker.export = {
    Button: createComponent(Button),
  };
})();

//<theme>
createTheme(2, {
  page: {
    color: ["red", "blue"],
    backgroundColor: ["white", "green"],
  },
});
//</theme>

const styles = createStyleSheet({});

!(function () {
  function createTheme(numOfThemes) {
    if (numOfThemes > 1) {
      const protoObj = { switchTheme };
      protoObj[symbolIdentifier] = { numOfThemes };

      return Object.create(protoObj);
    }
    return {};
  }
  function switchTheme(themeNum) {
    if (themeNum < this[symbolIdentifier].numOfThemes) {
    }
  }
})();
