//<
import "../../breaker";
//>

//Copyright (c) 2023.
//Bismark Yamoah
//This file contains all icon components used accross several pages

!(function () {
  Breaker.pathname = "/module/components/icons.js";

  const { createComponent } = Breaker.ui;

  //Solid home icon component
  function HomeSolid({ size, color }) {
    this.elements = {
      icon: {
        style: {
          width: (size = size + "px"),
          height: size,
        },
      },
      path: {
        style: {
          fill: color,
        },
      },
    };
    return (
      <view>
        <svg
          style="enable-background:new 0 0 24 24;"
          version="1.1"
          viewBox="0 0 24 24"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          key="icon"
        >
          <g />
          <g>
            <path
              key="path"
              fill="#302e2d"
              d="M23.6,10.3L13.2,2.4c-0.7-0.5-1.7-0.5-2.5,0L0.4,10.3C-0.4,10.9,0,12,1,12h1v6.1C2,20.2,3.8,22,6,22h2   c0.6,0,1-0.4,1-1v-4.9C9,15,9.9,14,11,14h2c1.1,0,2,1,2,2.1V21c0,0.5,0.4,1,1,1h2c2.2,0,4-1.8,4-3.9V12h1   C23.9,12,24.3,10.9,23.6,10.3z"
            />
          </g>
        </svg>
      </view>
    );
  }

  //Export Icons
  Breaker.export = {
    HomeSolid: createComponent(HomeSolid),
  };

  //Set a shorter name "icons" for this module
  //Import into other modules via `require("icons")`
  Breaker.useRequire({ icons: "/module/components/icons.js" });
})();
