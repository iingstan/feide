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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
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

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

/**
 * 发布页面js
 */
var modal_confirm = __webpack_require__(1);
var modal_alert = __webpack_require__(0);

$('#header_nav>li:eq(1)').addClass('active');

var config = null;

function get_publish_list() {
  $.ajax({
    url: '/api/get_config',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      config = json.result;
    }
  })
  .fail(function (error) {

  })
}

get_publish_list();


$('#create_publish_btn').on('click', function () {
  var html = $($("#create_publish_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_publish_form').on('submit', function () {
    create_publish(function () {
      self.location.reload();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});

function create_publish(success, fail) {
  var publish_name = $.trim($('#publish_name').val());
  var publish_folder = $.trim($('#publish_folder').val());
  var publish_page = $('#publish_page').is(":checked");
  // var publish_datefolder = $('#publish_datefolder').is(":checked");
  //var publish_delete_file = $('#publish_delete_file').is(":checked");
  var publish_compress = $('#publish_compress').is(":checked");

  $.ajax({
    url: '/api/create_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      publish_name: publish_name,
      publish_folder: publish_folder,
      publish_page: publish_page,
      // publish_datefolder: publish_datefolder,
      //publish_delete_file: publish_delete_file,
      publish_compress: publish_compress
    }
  })
    .done(function (json) {
      //console.info(json);
      if (json.re) {
        if (success) {
          success();
        }
      }
      else {
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

$('.delete_publish_btn').on('click', function () {
  var index = $(this).data('index');
  modal_confirm({
    content: '确定要删除吗？',
    onConfirm: function () {
      delete_publish(index);
    }
  });
  return false;
});

/**
 * 删除发布配置
 * 
 * @param {any} index 
 */
function delete_publish(index) {
  $.ajax({
    url: '/api/delete_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index
    }
  })
    .done(function (json) {
      if (json.re) {
        self.location.reload();
      }
      else {
        modal_alert({
          content: "删除失败！ " + json.message
        });
      }
    })
    .fail(function (error) {
      modal_alert({
        content: "删除失败！ " + error.message
      });
    })
    .always(function () {

    });
};


$('.edit_publish_btn').on('click', function () {
  var index = $(this).data('index');

  var html = $(Handlebars.compile($("#edit_publish_template").html())(config.publish[index]));

  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#edit_publish_form').on('submit', function () {
    edit_publish(index, function () {
      self.location.reload();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
  return false;
});



/**
 * 修改发布配置
 * 
 * @param {any} index 
 */
function edit_publish(index, success, fail) {
  var publish_name = $.trim($('#publish_name').val());
  var publish_folder = $.trim($('#publish_folder').val());
  var publish_page = $('#publish_page').is(":checked");
  // var publish_datefolder = $('#publish_datefolder').is(":checked");
  //var publish_delete_file = $('#publish_delete_file').is(":checked");
  var publish_compress = $('#publish_compress').is(":checked");

  $.ajax({
    url: '/api/edit_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index,
      publish_name: publish_name,
      publish_folder: publish_folder,
      publish_page: publish_page,
      // publish_datefolder: publish_datefolder,
      //publish_delete_file: publish_delete_file,
      publish_compress: publish_compress
    }
  })
    .done(function (json) {
      //console.info(json);
      if (json.re) {
        if (success) {
          success();
        }
      }
      else {
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

$('.publish_publish_btn').on('click', function () {
  var index = $(this).data('index');

  $.ajax({
    url: '/publish/publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index
    }
  })
  .done(function (json) {
    if(json.re){
      modal_alert('发布成功！');
    }
    else{
      modal_alert('发布失败！' + json.message);
    }
  })
  .fail(function (error) {
    modal_alert(error.message);
  })
  .always(function () {

  });


  return false;
});

/***/ })

/******/ });