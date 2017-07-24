/**
 * error_message
 */


module.exports = function(ele, message, color){
  var dcolor = "warning";
  if(color){
    dcolor = color;
  }
  if(ele.html() == ""){
    ele.html('<div class="alert alert-dismissible alert-' + dcolor + '"><button type="button" class="close" data-dismiss="alert">&times;</button><p>' + message + '</p></div>');
  }
}