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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

/**
 * modal 确认框
 */


function modal_confirm(options) {
    this.options = $.extend({
        title: '提示',
        content: '',
        onCancel: null,
        onConfirm: null
    }, options);
}

modal_confirm.prototype.show = function () {
    var html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><div class="modal-body"><p>' + this.options.content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button> <button type="button" class="btn btn-primary">确定</button></div></div></div></div>');
    $("body").append(html);
    html.modal('show');

    html.on('click', '.btn-primary', function(){
        html.modal('hide');
        if(this.options.onConfirm){
            this.options.onConfirm();
        }
    }.bind(this));

    html.on('hidden.bs.modal', function (e) {
        html.remove();
        if(this.options.onCancel){
            this.options.onCancel();
        }
    }.bind(this));
};

module.exports = function(options){
    var new_modal_confirm = new modal_confirm(options);
    new_modal_confirm.show();
};

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

var modal_confirm = __webpack_require__(1);

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});



$.ajaxSetup({
  cache: false
});

// $('.navbar .dropdown').on('click', function(){
//   return false;
// });
// $('.navbar .dropdown').on('mouseenter', function(){
//   console.info(111);
//   $(this).addClass('open');
//   return false;
// });
// // $('.navbar .dropdown').on('mouseout', function(){
// //   console.info(222);
// //   $(this).removeClass('open');
// //   return false;
// // });




$('[data-toggle="checkbox"]').radiocheck();
$('[data-toggle="radio"]').radiocheck();
$('[data-toggle="switch"]').bootstrapSwitch();



// Handlebars.registerHelper('showTime', function (date) {
//   return new Date(date).toLocaleString();
// });

function fillzero(num){
  if(num < 10){
    return '0' + num;
  }
  return num.toString();
}

Handlebars.registerHelper('showTime', function (date) {
  let thisdate = new Date(date);
  return thisdate.getFullYear() + '/' + (thisdate.getMonth() + 1) + '/' + thisdate.getDate() + ' ' + thisdate.getHours() + ':' + fillzero(thisdate.getMinutes());
  //return new Date(date).toLocaleString();
});

Handlebars.registerHelper('tslink', function (path) {
  if (path.substring(path.length - 3) == '.ts') {
    return path.substring(0, path.length - 2) + 'js'
  }
  return path
});

Handlebars.registerHelper('showFileSize', function (size) {
  var size = parseInt(size);
  var out = size;
  var hz = '';
  if (size > 1024 * 1024) {
    out = size / (1024 * 1024);
    hz = 'MB';
  }
  else if(size > 1024){
    out = size / 1024;
    hz = 'KB';    
  }
  else{
    hz = 'B';    
  }
  
  if(size > 1024){
    if(out >= 100){
      out = out.toFixed(0);
    }
    else if(out >= 10){
      out = out.toFixed(1);
    }
    else{
      out = out.toFixed(2);
    }    
  }


  return out + ' ' + hz;
});


/***/ })

/******/ });