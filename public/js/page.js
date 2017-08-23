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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
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

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

var modal_alert = __webpack_require__(0);
var modal_confirm = __webpack_require__(1);
var error_message = __webpack_require__(5);

$('#header_nav li:eq(0)').addClass('active');


/**
 * 页面列表
 */
function get_page_list() {
  $.ajax({
    url: '/api/pagelist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#pagelist_template").html())(json.result);
      $('#pagelist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_page_list();

/**
 * 删除页面
 */
$('body').on('click', '.delete_page_btn', function () {
  var pagename = $(this).data('pagename');
  modal_confirm({
    content:'确定删除 <strong>page/' + pagename + '</strong> 文件夹吗？',
    onConfirm: function(){
      delete_page(pagename, function(){
        get_page_list();
      }, function(message){
        modal_alert(message);
      });
    }
  });
  return false;
});


/**
 * 删除页面
 * 
 * @param {any} pagename 
 */
function delete_page(pagename, success, fail) {
  $.ajax({
      url: '/page/delete_page',
      type: 'POST',
      dataType: 'json',
      data: {
        pagename: pagename
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


/**
 * 通用文件列表
 */
$.ajax({
    url: '/api/common_list',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#common_list_template").html())(json.result);
      $('#common_list').html(html);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });

/**
 * 公共库文件列表
 */

function get_libs_list() {
  $.ajax({
      url: '/api/libs_list',
      type: 'GET',
      dataType: 'json',
      data: {

      }
    })
    .done(function (json) {
      if (json.re) {
        var html = Handlebars.compile($("#libs_list_template").html())(json.result);
        $('#libs_list').html(html);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
}
get_libs_list();

/**
 * 删除公共库文件
 */
$('body').on('click', '.delete_libs_btn', function () {
    var libsname = $(this).data('libsname');
  modal_confirm({
    content:'确定删除 <strong>' + libsname + '</strong>？',
    onConfirm: function(){
      delete_libs(libsname, function(){
        get_libs_list();
      }, function(message){
        modal_alert(message);
      });
    }
  });
  return false;
});

/**
 * 删除公共库文件
 * 
 * @param {any} libsname 
 */
function delete_libs(libsname, success, fail) {
  $.ajax({
      url: '/api/delete_libs',
      type: 'POST',
      dataType: 'json',
      data: {
        libsname: libsname
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
 * 获取布局页列表
 * 
 * @param {any} callback 
 */
function get_layouts(callback) {
  $.ajax({
    url: 'get_layout',
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {   
    if (json.re) {
      callback(json.result);
    }
    else{
      modal_alert(json.message);
    }
  })
  .fail(function(error) {
    modal_alert(error.message);
  })
  .always(function() {
    
  });
}

/**
 * 新建页面
 */
$('#create_page_btn').on('click', function () {
  get_layouts(function(layouts){
    var html = $(Handlebars.compile($("#create_page_template").html())(layouts));
    $('body').append(html);
    html.modal('show');
    $('#page_layout').select2();
    $('[data-toggle="tooltip"]', html).tooltip();

    html.on('hidden.bs.modal', function (e) {
      html.remove();
    });

    $('#create_page_form').on('submit', function () {
      create_page(function () {
        self.location.reload();
      }, function (message) {
        console.info(message);
        modal_alert(message);
      });
      return false;
    });    
  });
});

function create_page(success, fail) {
  var page_name = $.trim($('#page_name').val());
  var extra_js = $('#extra_js').is(":checked");
  var extra_less = $('#extra_less').is(":checked");
  var page_layout = $('#page_layout').val();

  $.ajax({
      url: '/page/create_page',
      type: 'POST',
      dataType: 'json',
      data: {
        page_name: page_name,
        extra_js: extra_js,
        extra_less: extra_less,
        page_layout: page_layout
      }
    })
    .done(function (json) {
      //console.info(json);
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
 * 新建公共库
 */
$('#create_libs_btn').on('click', function () {
  var html = $($("#create_libs_template").html());
  $('body').append(html);
  html.modal('show');
  //$('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_libs_form').on('submit', function () {
    var create_libs_uploadfile = "";
    var create_libs_uploadurl = "";
    if ($('#create_libs_uploadfile').is(':visible')) {
      create_libs_uploadfile = $('#create_libs_uploadfile').val();
    } else if ($('#create_libs_uploadurl').is(':visible')) {
      create_libs_uploadurl = $.trim($('#create_libs_uploadurl').val());
    }

    if (create_libs_uploadfile != '' || create_libs_uploadurl != '') {
      create_libs(create_libs_uploadfile, create_libs_uploadurl, function () {
        html.modal('hide');
        get_libs_list();
      }, function (message) {
        error_message($('#error_message'), message);
      });
      return false;
    }

    error_message($('#error_message'), '请选择一种上传文件的方式！');
    $('#form_alert_div').show();
    return false;
  });
});

function create_libs(create_libs_uploadfile, create_libs_uploadurl, success, fail) {

  if (create_libs_uploadfile !== '') {
    var data = new FormData();
    data.append('create_libs_uploadfile', $('#create_libs_uploadfile')[0].files[0]);
    $.ajax({
        url: '/api/create_libs_byfile',
        type: 'POST',
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
      })
      .done(function (json) {
        if (json.re && success) {
          success();
        } else {
          if (fail) {
            fail(json.message);
          }
        }
      })
      .fail(function (error) {
        fail(error.message);
      })
      .always(function () {

      });
    return false;
  }

  if (create_libs_uploadurl !== '') {
    $.ajax({
        url: '/api/create_libs_byurl',
        type: 'POST',
        dataType: 'json',
        data: {
          create_libs_uploadurl: create_libs_uploadurl
        }
      })
      .done(function (json) {
        if (json.re && success) {
          success();
        } else {
          if (fail) {
            fail(json.message);
          }
        }
      })
      .fail(function (error) {
        fail(error.message);
      })
      .always(function () {

      });
    return false;
  }
  return false;
}

/**
 * 布局页列表
 * 
 */
function get_layout() {
  $.ajax({
    url: '/api/layoutlist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#layoutlist_template").html())(json.result);
      $('#layoutlist').html(html);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });
}

get_layout(); 

/**
 * 新建布局页
 */
$('#create_layout_btn').on('click', function () {
  var html = $($("#create_layout_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_layout_form').on('submit', function () {
    create_layout(function () {
      html.modal('hide');
      get_layout();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});

/**
 * 新建布局页
 * 
 * @param {any} success 成功回调
 * @param {any} fail 失败回调
 */
function create_layout(success, fail) {
  var layout_name = $.trim($('#layout_name').val());

  $.ajax({
      url: '/api/create_layout',
      type: 'POST',
      dataType: 'json',
      data: {
        layout_name: layout_name
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
};

/**
 * 删除布局页
 */
$('body').on('click', '.delete_layout_btn', function () {
    var layoutname = $(this).data('layoutname');
  modal_confirm({
    content:'确定删除 <strong>' + layoutname + '</strong>？',
    onConfirm: function(){
      delete_layout(layoutname, function(){
        get_layout();
      }, function(message){
        modal_alert(message);
      });
    }
  });
  return false;
});

/**
 * 删除布局页
 * 
 * @param {any} layout_name 
 */
function delete_layout(layout_name, success, fail) {
  $.ajax({
      url: '/api/delete_layout',
      type: 'POST',
      dataType: 'json',
      data: {
        layout_name: layout_name
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
 * 局部页列表
 * 
 */
function get_partial() {
  $.ajax({
    url: '/api/partiallist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#partiallist_template").html())(json.result);
      $('#partiallist').html(html);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });
}

get_partial(); 

/**
 * 新建局部页
 */
$('#create_partial_btn').on('click', function () {
  var html = $($("#create_partial_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_partial_form').on('submit', function () {
    create_partial(function () {
      html.modal('hide');
      get_partial();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});

/**
 * 新建局部页
 * 
 * @param {any} success 成功回调
 * @param {any} fail 失败回调
 */
function create_partial(success, fail) {
  var partial_name = $.trim($('#partial_name').val());

  $.ajax({
      url: '/api/create_partial',
      type: 'POST',
      dataType: 'json',
      data: {
        partial_name: partial_name
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
};

/**
 * 删除局部页
 */
$('body').on('click', '.delete_partial_btn', function () {
    var partialname = $(this).data('partialname');
  modal_confirm({
    content:'确定删除 <strong>' + partialname + '</strong>？',
    onConfirm: function(){
      delete_partial(partialname, function(){
        get_partial();
      }, function(message){
        modal_alert(message);
      });
    }
  });
  return false;
});

/**
 * 删除局部页
 * 
 * @param {any} partial_name 
 */
function delete_partial(partial_name, success, fail) {
  $.ajax({
      url: '/api/delete_partial',
      type: 'POST',
      dataType: 'json',
      data: {
        partial_name: partial_name
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
 * 查看文件
 */
$('body').on('click', '.viewfile_btn', function () {
  var filetype = $(this).data('filetype');
  var filename = $(this).data('filename');

  window.open('/file/view/' + filetype + '/' + filename);

  return false;
});

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

/**
 * error_message
 */


module.exports = function(ele, message, color){
  var dcolor = "warning";
  if(color){
    dcolor = color;
  }
  if(ele.html() == ""){
    ele.html('<div class="alert alert-dismissible alert-' + dcolor + '"><button type="button" class="close" data-dismiss="alert">&times;</button><p>' + message + '</p></div>');
  }
}

/***/ })

/******/ });