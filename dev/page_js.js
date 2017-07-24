/**
 * page/js
 */

var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_form = require('./modules/modal/modal_form');
var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');

$('#header_nav li:eq(0)').addClass('active');


/**
 * js列表
 */
function get_js_list() {
  $.ajax({
    url: '/page/jslist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#jslist_template").html())(json.result);
      $('#jslist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_js_list();

/**
 * 新建js
 */
$('#create_js_btn').on('click', function () {
  
  var html = $(Handlebars.compile($("#create_js_template").html())());
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '新建JS文件',
    content: html,
    formid: 'create_js_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#js_name').focus()
  },500)

  $('#create_js_form').on('submit', function () {
    create_js(function () {
      get_js_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false;
  });    

  return false
});

function create_js(success, fail) {
  var js_name = $.trim($('#js_name').val());

  if(js_name == 'libs'){
    modal_alert('不要建立名为libs的js和css文件，会和系统的libs文件冲突')
    return false
  }

  $.ajax({
      url: '/page/create_js',
      type: 'POST',
      dataType: 'json',
      data: {
        js_name: js_name
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

delete_file_confirm.bind('.delete_js_btn', function(){
  get_js_list();
})