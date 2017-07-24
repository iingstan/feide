/**
 * 删除文件提示框
 */

var modal_confirm = require('./modal_confirm');
var modal_alert = require('../modal_alert/modal_alert')

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