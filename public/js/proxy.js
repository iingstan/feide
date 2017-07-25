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

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

/**
 * 代理服务
 */
var modal_alert = __webpack_require__(0);

$('#header_nav>li:eq(2)').addClass('active');

$('#add_proxy_rule').on('click', function () {
  proxy_rule.add();
});

var proxy_rule = {
  add: function () {
    var html = Handlebars.compile($("#create_proxy_rule_template").html())({});
    $('#proxy_rules').append(html);
  },
  bind: function () {
    $('#proxy_rules').on('click', '.rule_moveup', function () {
      var thisrule = $(this).parents('.proxy_rules_item');
      var thisindex = thisrule.index();
      if (thisindex != 0) {
        $('.proxy_rules_item').eq(thisindex - 1).before(thisrule);
      }
    });
    $('#proxy_rules').on('click', '.rule_movedown', function () {
      var thisrule = $(this).parents('.proxy_rules_item');
      var thisindex = thisrule.index();
      if (thisindex != ($('.proxy_rules_item').length - 1)) {
        $('.proxy_rules_item').eq(thisindex + 1).after(thisrule);
      }
    });
    $('#proxy_rules').on('click', '.delete_rule', function () {
      if ($('.proxy_rules_item').length > 1) {
        $(this).parents('.proxy_rules_item').remove();
      } else {
        modal_alert({
          content: '最后一条规则不能删除！'
        });
      }

    });
  }
}

proxy_rule.add();
proxy_rule.bind();

$('#save_proxy').on('click', function () {
  var portnum = $('#portnum').val();
  var rules = [];
  $('.proxy_rules_item').each(function (i, v) {
    rules.push({
      route: $('.porxy_route', $(v)).val(),
      url: $('.porxy_url', $(v)).val()
    });
  });
  $.ajax({
      url: '/proxy/save',
      type: 'POST',
      dataType: 'json',
      data: {
        rules: JSON.stringify(rules),
        portnum: portnum
      }
    })
    .done(function (json) {
      if (json.re) {
        $('#save_proxy_tips').show();
        setTimeout(function () {
          $('#save_proxy_tips').hide();
        }, 3000);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
  return false;
});

$.ajax({
    url: '/proxy/getrules',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    console.info(json);
    if (json.re && json.result != null) {
      $('#portnum').val(json.result.proxy_port);
      if (json.result.proxy_rules.length > 1) {
        for (var i = 1; i < json.result.proxy_rules.length; i++) {
          proxy_rule.add();
        }
      }

      json.result.proxy_rules.forEach(function (v, i) {
        var item = $('.proxy_rules_item').eq(i);
        $('.porxy_route', item).val(v.route);
        $('.porxy_url', item).val(v.url);
      });

    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });

$('#open_proxy_form').on('submit', function () {
  var portnum = $('#portnum').val();
  var rules = [];
  $('.proxy_rules_item').each(function (i, v) {
    rules.push({
      route: $('.porxy_route', $(v)).val(),
      url: $('.porxy_url', $(v)).val()
    });
  });
  console.info(rules);
  $.ajax({
      url: '/proxy/open',
      type: 'POST',
      dataType: 'json',
      data: {
        rules: JSON.stringify(rules),
        portnum: portnum
      }
    })
    .done(function (json) {
      console.info(json);
      if (json.re) {
        $('#open_proxy').prop('disabled', true);
        $('#close_proxy').prop('disabled', false);

        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', true);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
  return false;
});

$('#close_proxy').on('click', function () {
  $.ajax({
      url: '/proxy/close',
      type: 'GET',
      dataType: 'json',
      data: {

      }
    })
    .done(function (json) {
      if (json.re) {
        $('#open_proxy').prop('disabled', false);
        $('#close_proxy').prop('disabled', true);

        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', false);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
});

$.ajax({
    url: '/proxy/state',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      if (json.result) {
        $('#open_proxy').prop('disabled', true);
        $('#close_proxy').prop('disabled', false);
        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', true);
      }
    }
  })
  .fail(function (error) {

  })

/***/ })

/******/ });