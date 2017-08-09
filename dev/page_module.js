
var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_form = require('./modules/modal/modal_form');
var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');

$('#header_nav li:eq(0)').addClass('active');


/**
 * module列表
 */
function get_module_list() {
  $.ajax({
    url: '/page/module_list',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#modulelist_template").html())(json.result);
      $('#modulelist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_module_list();

/**
 * 新建module
 */
$('#create_module_btn').on('click', function () {
  
  var html = $(Handlebars.compile($("#create_module_template").html())());
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '新建模块',
    content: html,
    formid: 'create_module_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#module_name').focus()
  },500)

  $('#create_module_form').on('submit', function () {
    create_module(function () {
      get_module_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false
  });    

  return false
});

function create_module(success, fail) {
  var module_name = $.trim($('#module_name').val());
  var module_description = $.trim($('#module_description').val());
  var module_template = $('#module_template').val();
  var create_md = $('#create_md').is(':checked')

  $.ajax({
      url: '/page/create_module',
      type: 'POST',
      dataType: 'json',
      data: {
        module_name: module_name,
        module_description: module_description,
        module_template: module_template,
        create_md: create_md
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
}

$('#modulelist').on('click', '.edit_module_json', function(){
  var module_name = $(this).data('modulename')

  $.ajax({
    url: '/page/module_info/' + module_name,
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {   
    if (json.re) {
      if(json.result == null){
        json.result = {}
      }
      json.result.module_name = module_name
      showModyModule(json.result)
    }
    else{
      modal_alert(json.message)
    }
  })
  .fail(function(error) {
    modal_alert(error.message)
  })

  return false
})

function showModyModule(module_json) {
  var html = $(Handlebars.compile($("#edit_module_template").html())(module_json));
  $('[data-toggle="tooltip"]', html).tooltip();

  var newmodalform = new modal_form({
    title: '编辑模块信息(package.json)',
    content: html,
    formid: 'mody_module_form'
  });

  newmodalform.show();

  setTimeout(function(){
    $('#module_description').focus()
  },500)

  $('#mody_module_form').on('submit', function () {
    mody_module(module_json.module_name, function () {
      get_module_list()
      newmodalform.close()
    }, function (message) {
      modal_alert(message)
    });
    return false
  });  
}

function mody_module(module_name, success, fail) {
  var module_info = {
    module_name: module_name,
    module_description: $.trim($('#module_description').val()),
    module_version: $.trim($('#module_version').val()),
    module_main: $('#module_main').val(),
    module_keywords: $('#module_keywords').val()    
  }

  $.ajax({
      url: '/page/mody_module',
      type: 'POST',
      dataType: 'json',
      data: module_info
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
}