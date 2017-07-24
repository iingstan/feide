/**
 * libs
 */

var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');

$('#header_nav li:eq(0)').addClass('active');


/**
 * 页面列表
 */
function get_page_list() {
  $.ajax({
    url: '/page/libslist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#libslist_template").html())(json.result);
      $('#libslist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_page_list();



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
        get_page_list();
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

delete_file_confirm.bind('.delete_lib_btn', function(){
  get_page_list();
})
