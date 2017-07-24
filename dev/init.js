/**
 * 初始化项目
 */
var modal_alert = require('./modules/modal_alert/modal_alert');

$(':radio').radiocheck();

var port = location.port;

$('#server_port').val(port);

$('#init_form').on('submit', function(){
  var project_name = $('#project_name').val();
  var server_port = $('#server_port').val();
  var new_file = $('[name="new_file"]:checked').val();
  $.ajax({
    url: '/init/init_project',
    type: 'POST',
    dataType: 'json',
    data: {
      project_name: project_name,
      server_port: server_port,
      new_file: new_file
    }
  }) 
  .done(function(json) {   
    if (json.re) {
      if(server_port == port){
        modal_alert({
          content: '初始化成功！',
          onClose: function(){
            self.location = '/';
          }
        });        
      }
      else{
        modal_alert({
          content: '初始化成功！由于修改了端口号，请关闭页面重启集成环境',
          onClose: function(){
            window.close();
          }
        });         
      }
    }
    else{
      modal_alert(json.message);
    }
  })
  .fail(function(error) {
    modal_alert(error.message);
  });


  return false;
});

//重定位项目框
var win_hei = $(window).height();
var box_hei = $('#initbox').height() + 40;
var mt = 0;

if(win_hei >= box_hei){
  mt = (win_hei - box_hei) / 2;
}
$('#initbox').css({'margin-top': mt});