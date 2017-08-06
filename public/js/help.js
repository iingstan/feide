/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports) {

/**
 * tips
 */

var tips_data = [
  'public文件夹里面都是不需要做任何处理的文件，发布的时候将原封不动的复制到指定文件夹。',
  'libs文件夹里面的内容不会被编译，里面的所有的js和css文件会被合并成 js/libs.js 和 css/libs.css。',
  '样式文件支持三种格式，less,scss,css，其中css格式不会进行编译处理。',
  'js文件支持三种形式，原生的js，需要Babel.js处理的ES6语法js，和Typescript，默认是原生的js，Babel.js需要在设置中开启才能使用。',
  '系统不提供删除文件的功能（本来是有的），因为在Node.js里面删除文件不会进入回收站，会直接彻底删除。',
  '代理服务是前后端结合开发的利器，代理掉其他网站的接口是最常用的方法'
]

var index = Math.floor(Math.random()*tips_data.length)
    
var tips_html = $('<div class="jumbotron"><h3>Tips</h3><p class="content"></p><p><a class="btn btn-primary btn-lg next_tips">下一条</a> <a class="btn btn-primary btn-lg pre_tips">上一条</a></p></div>')

function show_index(showindex) {
  $('.content', tips_html).text(tips_data[showindex] + '(' + (showindex+1) + '/' + tips_data.length + ')')
}

show_index(index)

tips_html.on('click', '.next_tips', function(){
  index++
  if(index == tips_data.length) index = 0
  show_index(index)
})

tips_html.on('click', '.pre_tips', function(){
  index--
  if(index == -1) index = tips_data.length - 1
  show_index(index)
})

module.exports = function(container){
  container.html(tips_html)
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {



let tips = __webpack_require__(4)
tips($('#tips'))

$('#header_nav li:eq(3)').addClass('active'); 

/***/ })

/******/ });