/**
 * log
 */
var argv = require('minimist')(process.argv.slice(2));
const colors = require('colors');
var moment = require('moment');

// 颜色种类
// text colors
// black
// red
// green
// yellow
// blue
// magenta
// cyan
// white
// gray
// grey

// background colors
// bgBlack
// bgRed
// bgGreen
// bgYellow
// bgBlue
// bgMagenta
// bgCyan
// bgWhite

// styles
// reset
// bold
// dim
// italic
// underline
// inverse
// hidden
// strikethrough

// extras
// rainbow
// zebra
// america
// trap
// random

let isshow = false;
if(argv.log == true){
  isshow = true
}

module.exports = {
  log(text, color){
    if(!isshow) return false
    if(color != undefined){
      console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss:SSS")}] ${colors[color](text)}`)
    }
    else{
      console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss:SSS")}] ${text}`)
    }
  }
}