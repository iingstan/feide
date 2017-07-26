//js_compile

var modal_alert = require('./modules/modal_alert/modal_alert');

$('#header_nav>li:eq(3)').addClass('active');

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
  if(config.js_babel){
    $('#js_babel').attr('checked', true)
  }
  else{
    $('#js_babel').attr('checked', false)
  }
  
});


$('#mody_config_form').on('submit', function () {
  var js_babel = $('#js_babel').is(':checked'); 

  $.ajax({
    url: '/api/mody_config',
    type: 'POST',
    dataType: 'json',
    data: {
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

  return false;
});
