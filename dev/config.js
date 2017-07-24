var modal_alert = require('./modules/modal_alert/modal_alert');

$('#header_nav>li:eq(5)').addClass('active');


function get_config(callback) {
  $.ajax({
    url: '/api/get_config',
    type: 'GET',
    dataType: 'json',
    data: {
    }
  })
  .done(function (json) {
    if(json.re){
      callback(json.result);
    }
  })
  .fail(function (error) {
    modal_alert('获取配置文件失败！');
  })
}

get_config(function(config){
  $('#project_name').val(config.project_name);
  $('#manage_server_port').val(config.manage_server_port);
  if(config.css_compress){
    if(config.css_compress.css_compress_ie){
      $('#css_compress_ie').val(config.css_compress.css_compress_ie);
    }
  }
  if(config.js_babel){
    $('#js_babel').attr('checked', true)
  }
  else{
    $('#js_babel').attr('checked', false)
  }
  
});

$('#mody_config_form').on('submit', function () {
  var project_name = $.trim($('#project_name').val());
  var manage_server_port = $.trim($('#manage_server_port').val());
  var css_compress_ie = $('#css_compress_ie').val();
  var js_babel = $('#js_babel').is(':checked'); 

  $.ajax({
    url: '/api/mody_config',
    type: 'POST',
    dataType: 'json',
    data: {
      project_name: project_name,
      manage_server_port: manage_server_port,
      css_compress_ie: css_compress_ie,
      js_babel: js_babel
    }
  })
    .done(function (json) {
      console.info(json);
      if (json.re) {
        modal_alert({
          content: '修改成功！',
          onClose: function () {
            self.location.reload();
          }
        });
      }
      else {
        modal_alert({ content: '修改失败！' + json.message });
      }
    })
    .fail(function (error) {
      modal_alert({ content: '修改失败！' + error.message });
    })
    .always(function () {

    });

  return false;
});



// $('#modal_alert').on('hidden.bs.modal', function (e) {
//   console.info(111);
// });