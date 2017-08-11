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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
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

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {


var modal_alert = __webpack_require__(0);
var modal_form = __webpack_require__(3);
var delete_file_confirm =  __webpack_require__(2);

$('#header_nav li:eq(0)').addClass('active');


/**
 * module列表
 */
function get_module_list() {
  $.ajax({
    url: '/page/module_list',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#modulelist_template").html())(json.result);
      $('#modulelist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_module_list();

/**
 * 新建module
 */
$('#create_module_btn').on('click', function () {
  
  var html = $(Handlebars.compile($("#create_module_template").html())());
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '新建模块',
    content: html,
    formid: 'create_module_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#module_name').focus()
  },500)

  $('#create_module_form').on('submit', function () {
    create_module(function () {
      get_module_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false
  });    

  return false
});

function create_module(success, fail) {
  var module_name = $.trim($('#module_name').val());
  var module_description = $.trim($('#module_description').val());
  var module_template = $('#module_template').val();
  var create_md = $('#create_md').is(':checked')

  $.ajax({
      url: '/page/create_module',
      type: 'POST',
      dataType: 'json',
      data: {
        module_name: module_name,
        module_description: module_description,
        module_template: module_template,
        create_md: create_md
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
}

$('#modulelist').on('click', '.edit_module_json', function(){
  var module_name = $(this).data('modulename')

  $.ajax({
    url: '/page/module_info/' + module_name,
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {   
    if (json.re) {
      if(json.result == null){
        json.result = {}
      }
      json.result.module_name = module_name
      showModyModule(json.result)
    }
    else{
      modal_alert(json.message)
    }
  })
  .fail(function(error) {
    modal_alert(error.message)
  })

  return false
})

function showModyModule(module_json) {
  var html = $(Handlebars.compile($("#edit_module_template").html())(module_json));
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '编辑模块信息(package.json)',
    content: html,
    formid: 'mody_module_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#module_description').focus()
  },500)

  $('#mody_module_form').on('submit', function () {
    mody_module(module_json.module_name, function () {
      get_module_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false
  });  
}

function mody_module(module_name, success, fail) {
  var module_info = {
    module_name: module_name,
    module_description: $.trim($('#module_description').val()),
    module_version: $.trim($('#module_version').val()),
    module_main: $('#module_main').val(),
    module_keywords: $('#module_keywords').val()    
  }

  $.ajax({
      url: '/page/mody_module',
      type: 'POST',
      dataType: 'json',
      data: module_info
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
}

$('#setup_module_btn').click(function(){

  $.ajax({
    url: '/api/get_config',
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {   
    var html = $(Handlebars.compile($("#setup_module_template").html())(json.result));
    $('[data-toggle="tooltip"]', html).tooltip();

    var newmodalform = new modal_form({
      title: '模块库设置',
      content: html,
      formid: 'setup_module_form'
    });

    newmodalform.show();   
    
    $('#setup_module_form').on('submit', function () {
      setup_module_server(function () {
        newmodalform.close()
      }, function (message) {
        modal_alert(message)
      });
      return false
    }); 
  })
  .fail(function(error) {
    modal_alert(error.message)
  })

  return false
})


function setup_module_server(success, fail) {
  var module_server_info = {
    module_server_url: $.trim($('#module_server_url').val()),
    module_author: $.trim($('#module_author').val()) 
  }

  $.ajax({
    url: '/page/setup_module_server',
    type: 'POST',
    dataType: 'json',
    data: module_server_info
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
}

$('#modulelist').on('click', '.upload_module_btn', function(){
  var path = $(this).data('path')
  $.ajax({
    url: '/page/upload_module',
    type: 'POST',
    dataType: 'json',
    data: {
      path: path
    }
  })
  .done(function(json) {   
    if (json.re) {
      modal_alert('发布成功')
    }
    else{
      modal_alert(json.message)
    }
  })
  .fail(function(error) {
    modal_alert(error.message)
  })
  return false
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
        onClose: null
    }, options);
}

modal_form.prototype.show = function () {
    var html = this.html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><form action="" id="' + this.options.formid + '"><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default form_cancel_btn"><span class="fui-cross"></span> 取消</button><button type="submit" class="btn btn-primary form_submit_btn"><span class="fui-check"></span> 确定</button></div></form></div></div></div>');
    $('.modal-body', html).append(this.options.content);
    $("body").append(html);
    html.modal('show');

    // html.on('click', '.form_submit_btn', function(){
    //     html.modal('hide');
    // });

    html.on('click', '.form_cancel_btn', function(){
        html.modal('hide');
    });    

    html.on('hidden.bs.modal', function (e) {
        html.remove();
        if(this.options.onClose){
            this.options.onClose();
        }
    }.bind(this));
};

modal_form.prototype.close = function(){
  this.html.modal('hide');
}


module.exports = modal_form

/***/ })

/******/ });