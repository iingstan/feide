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
var modal = __webpack_require__(26)
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

function reload_module_list() {
  get_module_list()
}

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

$('#modulelist').on('click', '.panel', function(){
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
      showLocalModule(json.result)
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
  
function showLocalModule(module_json) {
  var html = $(Handlebars.compile($("#local_module_info_template").html())(module_json));
  console.info(html);
  modal({
    title: module_json.module_name + '模块',
    content: html
  });



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
      modal_alert('发布失败！ ' + json.message)
    }
  })
  .fail(function(error) {
    modal_alert(error.message)
  })
  return false
})

var module_server_config = null;
$('#browser_module_btn').on('click', function(){
  $.ajax({
    url: '/api/get_config',
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(config) {
    config = config.result
    if (config.module_server_url == undefined || config.module_server_url == '') {
      modal_alert('还没有配置模块库服务器地址')
      return false
    }  
    module_server_config = config
    $.ajax({
      url: config.module_server_url + '/api/modules',
      type: 'GET',
      dataType: 'json',
      data: {
        
      }
    })
    .done(function(json) {   
      var html = $(Handlebars.compile($("#browser_module_template").html())({
        modules: json,
        config: config
      }));

      var newmodalform = new modal_form({
        title: '浏览模块库',
        content: html,
        formid: 'browser_module_form',
        size: 'big'
      });

      newmodalform.show(); 

      bindSearchModule()
      return false    
    })
    .fail(function(error) {
      
    })    
  })
  .fail(function(error) {
    
  })
  return false
})

function bindSearchModule() {
  $('#browser_module_form').on('click', '.panel', function(){
    let module_name = $(this).data('name')
    $.ajax({
      url: module_server_config.module_server_url + '/api/module/' + module_name,
      type: 'GET',
      dataType: 'json',
      data: {
        
      }
    })
    .done(function(json) {   
      json.module_server_url = module_server_config.module_server_url
      json.module_name = module_name
      var html = $(Handlebars.compile($("#module_info_template").html())(json));

      var newmodalform = new modal_form({
        title: '下载 <a href="' + module_server_config.module_server_url + '/modules/info/' + module_name + '" target="_blank">' + module_name + '</a> 模块？',
        content: html,
        formid: 'download_module_form',
      });

      newmodalform.show();

      $('#version_select').on('change', function(){
        var this_version = $(this).val()
        changeVersion(module_name, this_version)
      })

      $('#download_module_form').submit(function(){
        downloadModule(module_name, $('#version_select').val(), function(){
          modal_alert({
            content: '下载成功！',
            onClose: function(){
              newmodalform.close()
              reload_module_list()
            }
          })
        }, function(message){
          modal_alert('下载失败！ ' + message)
        })
        return false
      })
    })
    .fail(function(error) {
      
    })
 
    return false
  })

  $('#search_key').on('input', _.debounce(function(){
    let key = $.trim($(this).val())
    //console.info(key);
    showSearch(key)
    return false
  }, 250))

  $('#clean_search').on('click', function(){
    $('#search_key').val('')
    showSearch('')
    return false
  })
  
  $('#module_list').on('click', '.immed_down', function(){

    return false
  })
}

function showSearch(key) {
  $.ajax({
    url: module_server_config.module_server_url + '/api/modules',
    type: 'GET',
    dataType: 'json',
    data: {
      search: key
    }
  })
  .done(function(json) {   
    var html = $(Handlebars.compile($("#browser_modulelist_template").html())({
      modules: json,
      config: module_server_config
    }));

    $('#module_list').html(html)

  })
  .fail(function(error) {
    
  })   
}

/**
 * 
 * 更换版本
 * 
 */
function changeVersion(module_name, this_version) {
  $.ajax({
    url: module_server_config.module_server_url + '/api/module/' + module_name + '?version='+ this_version,
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {
    json.module_server_url = module_server_config.module_server_url
    json.module_name = module_name
    var html = Handlebars.compile($("#module_info2_template").html())(json);
    $('#module_info2').html(html);
  })
  .fail(function(error) {
    alert('获取模块信息失败')
  })
}

/**
 * 下载模块
 * 
 * @param {any} module_name 模块名字
 * @param {any} module_version 模块版本
 */
function downloadModule(module_name, module_version, succ, fail) {
  $.ajax({
    url: '/page/download_module',
    type: 'POST',
    dataType: 'json',
    data: {
      module_name: module_name,
      module_version: module_version
    }
  })
  .done(function(json) {   
    if(json.re){
      succ()
    }
    else{
      fail(json.message)
    }
  })
  .fail(function(error) {
    fail(error.message)
  })
}

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

/***/ 26:
/***/ (function(module, exports) {

/**
 * 模态框
 */


function modal_alert(options) {
    this.options = $.extend({
        title: '提示',
        content: '',
        onClose: null
    }, options);
}

modal_alert.prototype.show = function () {
    var html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><div class="modal-body"><p>' + this.options.content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button></div></div></div></div>');

    $('.modal-body p', html).html(this.options.content);

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