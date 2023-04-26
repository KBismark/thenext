module.exports = (function ConsoleStyle() {
  // console.log('\x1b[36m',\x1b[44m, 'sometext' ,'\x1b[0mm'); color, background, text, reset
  var textvalue = "";
  var This = {
    text: function (text) {
      textvalue = text;
      return This;
    },
    get: function () {
      var text = textvalue;
      textvalue = "";
      return text;
    },
    bold: function () {
      textvalue = `\x1b[${1}m${textvalue}\x1b[0m`;
      return This;
    },
    italize: function () {
      textvalue = `\x1b[${3}m${textvalue}\x1b[0m`;
      return This;
    },
    underline: function () {
      textvalue = `\x1b[${4}m${textvalue}\x1b[0m`;
      return This;
    },
    whiteBG: function () {
      textvalue = `\x1b[${47}m${textvalue}\x1b[0m`;
      return This;
    },
    blackBG: function () {
      textvalue = `\x1b[${40}m${textvalue}\x1b[0m`;
      return This;
    },
    redBG: function () {
      textvalue = `\x1b[${41}m${textvalue}\x1b[0m`;
      return This;
    },
    greenBG: function () {
      textvalue = `\x1b[${42}m${textvalue}\x1b[0m`;
      return This;
    },
    yellowBG: function () {
      textvalue = `\x1b[${43}m${textvalue}\x1b[0m`;
      return This;
    },
    blueBG: function () {
      textvalue = `\x1b[${44}m${textvalue}\x1b[0m`;
      return This;
    },
    magentaBG: function () {
      textvalue = `\x1b[${45}m${textvalue}\x1b[0m`;
      return This;
    },
    cyanBG: function () {
      textvalue = `\x1b[${46}m${textvalue}\x1b[0m`;
      return This;
    },
    greyBG: function () {
      textvalue = `\x1b[${100}m${textvalue}\x1b[0m`;
      return This;
    },
    invisible: function () {
      textvalue = `\x1b[${8}m${textvalue}\x1b[0m`;
      return This;
    },
    strike: function () {
      textvalue = `\x1b[${9}m${textvalue}\x1b[0m`;
      return This;
    },
    greyColor: function () {
      textvalue = `\x1b[${30}m${textvalue}\x1b[0m`;
      return This;
    },
    redColor: function () {
      textvalue = `\x1b[${31}m${textvalue}\x1b[0m`;
      return This;
    },
    greenColor: function () {
      textvalue = `\x1b[${32}m${textvalue}\x1b[0m`;
      return This;
    },
    yellowColor: function () {
      textvalue = `\x1b[${33}m${textvalue}\x1b[0m`;
      return This;
    },
    blueColor: function () {
      textvalue = `\x1b[${34}m${textvalue}\x1b[0m`;
      return This;
    },
    magentaColor: function () {
      textvalue = `\x1b[${35}m${textvalue}\x1b[0m`;
      return This;
    },
    cyanColor: function () {
      textvalue = `\x1b[${36}m${textvalue}\x1b[0m`;
      return This;
    },
    whiteColor: function () {
      textvalue = `\x1b[${37}m${textvalue}\x1b[0m`;
      return This;
    },
  };
  return This;
})();

const clearLastLine = () => {
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // from cursor to end
};
