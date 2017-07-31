/**
 * index
 */

let tips = require('./modules/tips/tips')

tips($('#tips'))

$.ajax({
  url: '/home/newver',
  type: 'GET',
  dataType: 'json',
  data: {
    
  }
})
.done(function(json) {   
  if(json.re){
    if(json.result.isnew){
      var html = $('<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button>有新版本！ 新版本号：<span id="newver">' + json.result.newver + '</span></div>')
      $('#hasnew').html(html)
    }
  }
})
.fail(function(error) {
  
})