//<
import "../../breaker";
//>

/*
Copyright (c) 2023.
Bismark Yamoah

This file contains all icon components used accross several pages
*/

!(function () {
  Breaker.pathname = "/module/components/icons.js";

  const { createComponent } = Breaker.ui;

  function CommonSolids({ size, iconProps, pathProps }) {
    iconProps.style = {
      ...(iconProps.style || {}),
      width: (size = size + "px"),
      height: size,
    };

    this.elements = {
      icon: iconProps,
      path: pathProps,
    };
    return (
      <view>
        <svg
          key="icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path key="path" fill="#302e2d" />
        </svg>
      </view>
    );
  }
  CommonSolids = createComponent(CommonSolids);

  function PuzzleSolid({ size, color }) {
    const d =
      "M13 2a2.47 2.47 0 0 1 2.47 2.47l-.001.53H19a1 1 0 0 1 1 1l-.001 3.499-1.53.001a2.47 2.47 0 0 0-2.464 2.307L16 11.97v.06a2.47 2.47 0 0 0 2.307 2.465l.163.005 1.529-.001.001 3.504a1 1 0 0 1-1 1l-3.531-.001v.528a2.47 2.47 0 1 1-4.939 0v-.528H7a1 1 0 0 1-1-1l-.001-3.531h-.53a2.47 2.47 0 0 1 0-4.94H6L6 6a1 1 0 0 1 1-1h3.53v-.53A2.47 2.47 0 0 1 13 2Z";
    return CommonSolids({
      size,
      iconProps: { style: { fill: "none" } },
      pathProps: { d, style: { fill: color } },
    });
  }
  function Puzzle2Solid({ size, color }) {
    const d =
      "M512 288c0 35.35-21.49 64-48 64c-32.43 0-31.72-32-55.64-32C394.9 320 384 330.9 384 344.4V480c0 17.67-14.33 32-32 32h-71.64C266.9 512 256 501.1 256 487.6C256 463.1 288 464.4 288 432c0-26.51-28.65-48-64-48s-64 21.49-64 48c0 32.43 32 31.72 32 55.64C192 501.1 181.1 512 167.6 512H32c-17.67 0-32-14.33-32-32v-135.6C0 330.9 10.91 320 24.36 320C48.05 320 47.6 352 80 352C106.5 352 128 323.3 128 288S106.5 223.1 80 223.1c-32.43 0-31.72 32-55.64 32C10.91 255.1 0 245.1 0 231.6v-71.64c0-17.67 14.33-31.1 32-31.1h135.6C181.1 127.1 192 117.1 192 103.6c0-23.69-32-23.24-32-55.64c0-26.51 28.65-47.1 64-47.1s64 21.49 64 47.1c0 32.43-32 31.72-32 55.64c0 13.45 10.91 24.36 24.36 24.36H352c17.67 0 32 14.33 32 31.1v71.64c0 13.45 10.91 24.36 24.36 24.36c23.69 0 23.24-32 55.64-32C490.5 223.1 512 252.7 512 288z";
    return CommonSolids({
      size,
      iconProps: { viewBox: "0 0 512 512" },
      pathProps: { d, style: { fill: color } },
    });
  }
  function GroupSolid({ size, color }) {
    const d =
      "M14.75 15C15.7165 15 16.5 15.7835 16.5 16.75L16.4989 17.7121C16.6156 19.9012 14.9879 21.009 12.0668 21.009C9.15786 21.009 7.5 19.9192 7.5 17.75V16.75C7.5 15.7835 8.2835 15 9.25 15H14.75ZM3.75 10L8.126 10.0001C8.04375 10.3197 8 10.6547 8 11C8 12.1155 8.45665 13.1244 9.1932 13.8499L9.35526 14.001L9.25 14C8.94865 14 8.65863 14.0485 8.38729 14.138C7.52255 14.4235 6.84765 15.1264 6.60122 16.0082L6.56679 16.009C3.65786 16.009 2 14.9192 2 12.75V11.75C2 10.7835 2.7835 10 3.75 10ZM20.25 10C21.2165 10 22 10.7835 22 11.75L21.9989 12.7121C22.1156 14.9012 20.4879 16.009 17.5668 16.009L17.3985 16.0073C17.1596 15.1534 16.5188 14.4673 15.6929 14.1659C15.4576 14.08 15.2073 14.0254 14.947 14.0069L14.75 14L14.6447 14.001C15.4758 13.268 16 12.1952 16 11C16 10.6547 15.9563 10.3197 15.874 10.0001L20.25 10ZM12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8ZM6.5 3C8.15685 3 9.5 4.34315 9.5 6C9.5 7.65685 8.15685 9 6.5 9C4.84315 9 3.5 7.65685 3.5 6C3.5 4.34315 4.84315 3 6.5 3ZM17.5 3C19.1569 3 20.5 4.34315 20.5 6C20.5 7.65685 19.1569 9 17.5 9C15.8431 9 14.5 7.65685 14.5 6C14.5 4.34315 15.8431 3 17.5 3Z";
    return CommonSolids({
      size,
      iconProps: { style: { fill: "none" } },
      pathProps: { d, style: { fill: color } },
    });
  }

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
    Puzzle2Solid,
    PuzzleSolid,
  };

  //Set a shorter name "icons" for this module
  //Import into other modules via `require("icons")`
  Breaker.useRequire({ icons: "/module/components/icons.js" });
})();
