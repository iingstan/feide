/**
 * page/css
 */

var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_form = require('./modules/modal/modal_form');
var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');

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
