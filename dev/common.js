var modal_confirm = require('./modules/modal_confirm/modal_confirm');

$(function () {
  setTimeout(function() {
    $('[data-toggle="tooltip"]').tooltip();    
  }, 500);

});



$.ajaxSetup({
  cache: false
});

// $('.navbar .dropdown').on('click', function(){
//   return false;
// });
// $('.navbar .dropdown').on('mouseenter', function(){
//   console.info(111);
//   $(this).addClass('open');
//   return false;
// });
// // $('.navbar .dropdown').on('mouseout', function(){
// //   console.info(222);
// //   $(this).removeClass('open');
// //   return false;
// // });




$('[data-toggle="checkbox"]').radiocheck();
$('[data-toggle="radio"]').radiocheck();
$('[data-toggle="switch"]').bootstrapSwitch();



// Handlebars.registerHelper('showTime', function (date) {
//   return new Date(date).toLocaleString();
// });

function fillzero(num){
  if(num < 10){
    return '0' + num;
  }
  return num.toString();
}

Handlebars.registerHelper('showTime', function (date) {
  let thisdate = new Date(date);
  return thisdate.getFullYear() + '/' + (thisdate.getMonth() + 1) + '/' + thisdate.getDate() + ' ' + thisdate.getHours() + ':' + fillzero(thisdate.getMinutes());
  //return new Date(date).toLocaleString();
});

Handlebars.registerHelper('tslink', function (path) {
  if (path.substring(path.length - 3) == '.ts') {
    return path.substring(0, path.length - 2) + 'js'
  }
  return path
});

Handlebars.registerHelper('showFileSize', function (size) {
  var size = parseInt(size);
  var out = size;
  var hz = '';
  if (size > 1024 * 1024) {
    out = size / (1024 * 1024);
    hz = 'MB';
  }
  else if(size > 1024){
    out = size / 1024;
    hz = 'KB';    
  }
  else{
    hz = 'B';    
  }
  
  if(size > 1024){
    if(out >= 100){
      out = out.toFixed(0);
    }
    else if(out >= 10){
      out = out.toFixed(1);
    }
    else{
      out = out.toFixed(2);
    }    
  }


  return out + ' ' + hz;
});
