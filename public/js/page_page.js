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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
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

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

/**
 * page/page
 */
var modal_alert = __webpack_require__(0);
var modal_form = __webpack_require__(3);
var delete_file_confirm =  __webpack_require__(2);

$('#header_nav li:eq(0)').addClass('active');


/**
 * 页面列表
 */
function get_page_list() {
  $.ajax({
    url: '/page/pagelist',
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
 * 布局页列表
 * 
 */
function get_layout(callback) {
  $.ajax({
    url: '/page/layoutlist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      callback(json.result);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });
}

function get_layout_list() {
  get_layout(function(data){
    var html = Handlebars.compile($("#layoutlist_template").html())(data);
    $('#layoutlist').html(html);
  });   
}

get_layout_list()

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
      get_layout_list();
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
      url: '/page/create_layout',
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
 * 局部页列表
 */
function get_partial() {
  $.ajax({
    url: '/page/partiallist',
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
      url: '/page/create_partial',
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
 * 新建页面
 */
$('#create_page_btn').on('click', function () {
  get_layout(function(layouts){
    var html = $(Handlebars.compile($("#create_page_template").html())({
      layouts: layouts
    }));
    $('body').append(html);
    html.modal('show');

    //console.info($('.flat_checkbox', html).length);
      $('.flat_checkbox', html).radiocheck();
      //$(':checkbox').radiocheck();

    $('#page_layout').select2();
    $('[data-toggle="tooltip"]', html).tooltip();

    html.on('hidden.bs.modal', function (e) {
      html.remove();
    });

    setTimeout(function(){
      $('#page_name').focus()
    },500)

    $('#create_page_form').on('submit', function () {
      create_page(function () {
        get_page_list();
        html.modal('hide');
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

  if(page_name == 'libs' && (extra_js || extra_less)){
    modal_alert('不要建立名为libs的js和css文件，会和系统的libs文件冲突')
    return false
  }

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
 * 修改页面数据
 */
$('body').on('click', '.page_data_btn', function(){
  var pagepath = $(this).data('path');
  var filename = $(this).data('filename');
  $.ajax({
    url: '/page/get_page_data',
    type: 'GET',
    dataType: 'json',
    data: {
      pagepath : pagepath
    }
  })
  .done(function(json) {
    var html = $(Handlebars.compile($("#pagedata_template").html())({
      filename: filename
    }));
    $('#page_data', html).val(JSON.stringify(json.result));

    var modypagedata_formmodal = new modal_form({
      title: filename + '页面数据',
      formid: 'edit_pagedata_form',
      content: html
    });
    modypagedata_formmodal.show();

    $('#edit_pagedata_form').on('submit', function () {
      let data = $('#page_data', html).val();
      if($.trim(data) == ''){
        modal_alert('不能为空！');
        return false;
      }
      try {
        data = JSON.parse(data);
      } catch (error) {
        modal_alert('json格式化不正确！');
        return false;
      }
      mody_page_data(pagepath, data, function () {
        modypagedata_formmodal.close()
      }, function (message) {
        modal_alert(message);
      });
      return false;
    });   
  })
  .fail(function(error) {
    
  });
  return false;
});

/**
 * 修改页面数据
 */
function mody_page_data(filepath, data, succ, fail) {
  data = JSON.stringify(data);
  $.ajax({
    url: '/page/save_page_data',
    type: 'POST',
    dataType: 'json',
    data: {
      pagepath: filepath,
      pagedata: data
    }
  })
  .done(function(json) {
    if (json.re) {
      succ();
    } 
    else{
      fail(json.message);
    }  
    
  })
  .fail(function(error) {
    fail(error.message);
  })
  .always(function() {
    
  });
}




/**
 * 修改页面布局页
 */
$('body').on('click', '.change_layout_btn', function(){
  var pagepath = $(this).data('path');
  var filename = $(this).data('filename');
  $.ajax({
    url: '/page/layoutlist',
    type: 'GET',
    dataType: 'json',
    data: {
    }
  })
  .done(function(json) {
    var html = $(Handlebars.compile($("#page_layout_template").html())({
      layouts: json.result
    }));

    var layout_formmodal = new modal_form({
      title: '选择' + filename + '布局页',
      formid: 'page_layout_form',
      content: html
    });
    layout_formmodal.show();

    $.ajax({
      url: '/page/get_page_data',
      type: 'GET',
      dataType: 'json',
      data: {
        pagepath : pagepath
      }
    })
    .done(function(json) {   
      if(json.result.layout != undefined){
        $('#page_layout', html).val(json.result.layout);
      }
      else{
        $('#page_layout', html).val('');
      }
      $('#page_layout', html).select2();
    })
    .fail(function(error) {
      
    })
    .always(function() {
      
    });

    
    

    $('#page_layout_form').on('submit', function () {
      let layout = $('#page_layout', html).val();

      mody_page_layout(pagepath, layout, function () {
        layout_formmodal.close()
      }, function (message) {
        modal_alert(message);
      });
      return false;
    });   
  })
  .fail(function(error) {
    
  });
  return false;
});

/**
 * 修改页面布局页
 */
function mody_page_layout(filepath, layout, succ, fail) {
  $.ajax({
    url: '/page/mody_page_layout',
    type: 'POST',
    dataType: 'json',
    data: {
      layout: layout,
      pagepath: filepath
    }
  })
  .done(function(json) {
    if (json.re) {
      succ();
    } 
    else{
      fail(json.message);
    }  
    
  })
  .fail(function(error) {
    fail(error.message);
  })
  .always(function() {
    
  });
}

delete_file_confirm.bind('.delete_page_btn', function(){
  get_page_list();
})
delete_file_confirm.bind('.delete_layout_btn', function(){
  get_layout_list();
})
delete_file_confirm.bind('.delete_partial_btn', function(){
  get_partial();
})

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