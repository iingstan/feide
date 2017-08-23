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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/**
 * modal alert
 */


function modal_alert(options) {
    if( typeof options == "string"){
        options = {
            content: options,
        }
    }
    this.options = $.extend({
        title: '提示',
        content: '',
        onClose: null
    }, options);
}

modal_alert.prototype.show = function () {
    var html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><div class="modal-body"><p>' + this.options.content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button></div></div></div></div>');
    $("body").append(html);
    html.modal('show');

    html.on('click', '.btn-primary', function(){
        html.modal('hide');
    });

    html.on('hidden.bs.modal', function (e) {
        html.remove();
        if(this.options.onClose){
            this.options.onClose();
        }
    }.bind(this));
};

module.exports = function(options){
    var new_modal_alert = new modal_alert(options);
    new_modal_alert.show();
};

/***/ }),

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

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

/**
 * page/css
 */

var modal_alert = __webpack_require__(0);
var modal_form = __webpack_require__(3);
var delete_file_confirm =  __webpack_require__(2);

$('#header_nav li:eq(0)').addClass('active');


/**
 * css列表
 */
function get_css_list() {
  $.ajax({
    url: '/page/csslist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {

      var html = Handlebars.compile($("#csslist_template").html())(json.result);
      $('#csslist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_css_list();

/**
 * 新建css
 */
$('#create_css_btn').on('click', function () {
  
  var html = $(Handlebars.compile($("#create_css_template").html())());
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '新CSS文件',
    content: html,
    formid: 'create_css_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#css_name').focus()
  },500)

  $('#create_css_form').on('submit', function () {
    create_css(function () {
      get_css_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false;
  });    

  return false
});

function create_css(success, fail) {
  var css_name = $.trim($('#css_name').val());

  if(css_name == 'libs'){
    modal_alert('不要建立名为libs的js和css文件，会和系统的libs文件冲突')
    return false
  }

  $.ajax({
      url: '/page/create_css',
      type: 'POST',
      dataType: 'json',
      data: {
        css_name: css_name
      }
    })
    .done(function (json) {
      if (json.re) {
        if (success) {
          success();
        }
      } else {
        if (fail) {
          fail(json.message);
        }
      }
    })
    .fail(function (error) {
      if (fail) {
        fail(error.message);
      }
    })
    .always(function () {

    });
}




/**
 * partial_css列表
 */
function get_partial_css_list() {
  $.ajax({
    url: '/page/partial_csslist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      json.result = json.result.map(function(v){
        v.is_system_file = (v.filename == '_module_style.less' || v.filename == '_sprite.less')
        return v
      })
      //console.info(json.result)
      var html = Handlebars.compile($("#partial_csslist_template").html())(json.result);
      $('#partial_csslist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_partial_css_list();

/**
 * 新建partial_css
 */
$('#create_partial_css_btn').on('click', function () {
  
  var html = $(Handlebars.compile($("#create_partial_css_template").html())());
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '新建局部CSS文件',
    content: html,
    formid: 'create_partial_css_form'
  });

  newmodalform.show();

  $('#create_partial_css_form').on('submit', function () {
    create_partial_css(function () {
      get_partial_css_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false;
  });    

  return false
});

function create_partial_css(success, fail) {
  var partial_css_name = $.trim($('#partial_css_name').val());

  $.ajax({
      url: '/page/create_partial_css',
      type: 'POST',
      dataType: 'json',
      data: {
        partial_css_name: partial_css_name
      }
    })
    .done(function (json) {
      if (json.re) {
        if (success) {
          success();
        }
      } else {
        if (fail) {
          fail(json.message);
        }
      }
    })
    .fail(function (error) {
      if (fail) {
        fail(error.message);
      }
    })
    .always(function () {

    });
}

delete_file_confirm.bind('.delete_css_btn', function(){
  get_css_list();
})
delete_file_confirm.bind('.delete_css_partial_btn', function(){
  get_partial_css_list();
})


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

/**
 * 删除文件提示框
 */

var modal_confirm = __webpack_require__(1);
var modal_alert = __webpack_require__(0)

function delete_file(filepath, success, fail) {
  $.ajax({
      url: '/api/delete_file',
      type: 'POST',
      dataType: 'json',
      data: {
        filepath: filepath
      }
  })
  .done(function (json) {
    if (json.re) {
      if (success) {
        success();
      }
    } else {
      if (fail) {
        fail(json.message);
      }
    }
  })
  .fail(function (error) {
    if (fail) {
      fail(error.message);
    }
  });
}

module.exports = {
  bind: function(btn, callback){
    $('body').on('click', btn, function(){
      var filepath = $(this).data('filepath')
      modal_confirm({
        content:'确定删除 <strong>' + filepath + '</strong>？',
        onConfirm: function(){
          delete_file(filepath, function(){
            callback();
          }, function(message){
            modal_alert(message);
          });
        }
      });
      return false;
    })
  }
}

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/**
 * 模态框 表单
 */

function modal_form(options) {
  this.options = $.extend({
    title: '提示',
    formid: '',
    content: '',
    onClose: null,
    size: 'normal'
  }, options);
  switch (this.options.size) {
    case 'big':
      this.options.size = 'modal-lg'
      break;
    case 'smaill':
      this.options.size = 'modal-sm'
      break;
    default:
      this.options.size = ''
      break;
  }
}

modal_form.prototype.show = function () {


  var html = this.html = $('<div class="modal fade"><div class="modal-dialog '  + this.options.size +'"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><form action="" id="' + this.options.formid + '"><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default form_cancel_btn"><span class="fui-cross"></span> 取消</button><button type="submit" class="btn btn-primary form_submit_btn"><span class="fui-check"></span> 确定</button></div></form></div></div></div>');
  $('.modal-body', html).append(this.options.content);
  $("body").append(html);
  html.modal('show');

  // html.on('click', '.form_submit_btn', function(){
  //     html.modal('hide');
  // });

  html.on('click', '.form_cancel_btn', function () {
    html.modal('hide');
  });

  html.on('hidden.bs.modal', function (e) {
    html.remove();
    if (this.options.onClose) {
      this.options.onClose();
    }
  }.bind(this));
};

modal_form.prototype.close = function () {
  this.html.modal('hide');
}


module.exports = modal_form

/***/ })

/******/ });