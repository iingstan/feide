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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 23:
/***/ (function(module, exports) {

$('#header_nav li:eq(0)').addClass('active');

$.ajax({
  url: '/page/get_previewmap',
  type: 'GET',
  dataType: 'json',
  data: {

  }
})
  .done(function (json) {
    if (json.re) {
      makeJsmind(json.result);
    }
  })
  .fail(function (error) {

  });

function makeJsmind(data) {
  var minddata = {
    "meta": {
      "name": "",
      "author": "",
      "version": "",
    },
    "format": "node_array",
    "data": [
      { "id": "root", "isroot": true, "topic": data.config.project_name },

      //{ "id": "page", "parentid": "root", "topic": '<span class="glyphicon glyphicon-file"></span>' +  "Page", direction:"left" },
      // { "id": "sub11", "parentid": "page", "topic": "<strong>sub11</strong> <a class='btn btn-primary' href='http://www.baidu.com'>sdsfsdf</a>" },
      // { "id": "sub12", "parentid": "page", "topic": "sub12" },
      // { "id": "sub13", "parentid": "page", "topic": "sub13" },

      { "id": "css", "parentid": "root", "topic": "CSS" },
      
      //{ "id": "sub22", "parentid": "sub2", "topic": "sub22", "foreground-color": "#33ff33" },

      { "id": "js", "parentid": "root", "topic": "JS" },
      //{ "id": "js_page", "parentid": "js", "topic": "page" }
      
    ]
  };

  data.pagehbs.forEach(function(v){
    minddata.data.push({ "id": "page_" + v.name, "parentid": "root", "topic": '<a href="/preview/' + v.name + '" target="_blank">' + v.name + '.html</a>', direction:"left" });
  });

  if(data.pageless.length > 0){
    //minddata.data.push({ "id": "css_page", "parentid": "css", "topic": "page" });
    data.pageless.forEach(function(v){
      minddata.data.push({ "id": "pagecss_" + v.name, "parentid": "css", "topic": '<a href="/preview/css/' + v.name + '.css" target="_blank">' + v.name + '.css</a>' });
    }); 
  }

  if(data.libscss.length > 0){
    minddata.data.push({ "id": "css_libs", "parentid": "css", "topic": '<a href="/preview/css/libs.css" target="_blank">libs.css</a>' });   
  }  

  data.pagejs.forEach(function(v){
    minddata.data.push({ "id": "pagejs_" + v.name, "parentid": "js", "topic": '<a href="/preview/js/' + v.name + '.js" target="_blank">' + v.name + '.js</a>' });
  });

  if(data.libsjs.length > 0){
    minddata.data.push({ "id": "libsjs", "parentid": "js", "topic": '<a href="/preview/js/libs.js" target="_blank">libs.js</a>' });   
  }
  


  var options = {
    container: 'jsmind_container',
    editable: false,
    theme: 'primary',
    support_html: true,
    layout:{
      vspace :10
    }
  }
  var jm = jsMind.show(options, minddata);
}

// function load_jsmind() {
//   var mind = {
//     "meta": {
//       "name": "demo",
//       "author": "hizzgdev@163.com",
//       "version": "0.2",
//     },
//     "format": "node_array",
//     "data": [
//       { "id": "root", "isroot": true, "topic": "jsMind" },

//       { "id": "sub1", "parentid": "root", "topic": "sub1", "background-color": "#0000ff" },
//       { "id": "sub11", "parentid": "sub1", "topic": "<strong>sub11</strong> <a class='btn btn-primary' href='http://www.baidu.com'>sdsfsdf</a>" },
//       { "id": "sub12", "parentid": "sub1", "topic": "sub12" },
//       { "id": "sub13", "parentid": "sub1", "topic": "sub13" },

//       { "id": "sub2", "parentid": "root", "topic": "sub2" },
//       { "id": "sub21", "parentid": "sub2", "topic": "sub21" },
//       { "id": "sub22", "parentid": "sub2", "topic": "sub22", "foreground-color": "#33ff33" },

//       { "id": "sub3", "parentid": "root", "topic": "sub3" },
//     ]
//   };
//   var options = {
//     container: 'jsmind_container',
//     editable: false,
//     theme: 'primary',
//     support_html: true
//   }
//   var jm = jsMind.show(options, mind);
//   // jm.set_readonly(true);
//   // var mind_data = jm.get_data();
//   // alert(mind_data);
//   //jm.add_node("sub2","sub23", "new node", {"background-color":"red"});
//   //jm.set_node_color('sub21', 'green', '#ccc');
// }

//load_jsmind();

/***/ })

/******/ });