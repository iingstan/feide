
var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_form = require('./modules/modal/modal_form');
var modal = require('./modules/modal/modal')
var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');
var pager = require('./modules/pager');

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

function reload_module_list() {
  get_module_list()
}

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


$('#setup_module_btn').click(function(){

  $.ajax({
    url: '/api/get_user_config',
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {   
    var html = $(Handlebars.compile($("#setup_module_template").html())(json.result));
    $('[data-toggle="tooltip"]', html).tooltip();

    var newmodalform = new modal_form({
      title: '模块库设置',
      content: html,
      formid: 'setup_module_form'
    });

    newmodalform.show();   
    
    $('#setup_module_form').on('submit', function () {
      setup_module_server(function () {
        newmodalform.close()
        modal_alert('修改成功！')
      }, function (message) {
        modal_alert(message)
      });
      return false
    }); 
  })
  .fail(function(error) {
    modal_alert(error.message)
  })

  return false
})


function setup_module_server(success, fail) {
  var module_server_info = {
    module_server_url: $.trim($('#module_server_url').val()),
    module_author: $.trim($('#module_author').val()) 
  }

  $.ajax({
    url: '/page/setup_module_server',
    type: 'POST',
    dataType: 'json',
    data: module_server_info
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

$('#modulelist').on('click', '.panel', function(){
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
      showLocalModule(json.result)
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
  
function showLocalModule(module_json) {
  var html = $(Handlebars.compile($("#local_module_info_template").html())(module_json));
  
  modal({
    title: module_json.module_name + '模块',
    content: html
  });


}

$('#modulelist').on('click', '.upload_module_btn', function(){
  var path = $(this).data('path')
  $.ajax({
    url: '/page/upload_module',
    type: 'POST',
    dataType: 'json',
    data: {
      path: path
    }
  })
  .done(function(json) {   
    if (json.re) {
      modal_alert('发布成功')
    }
    else{
      modal_alert('发布失败！ ' + json.message)
    }
  })
  .fail(function(error) {
    modal_alert(error.message)
  })
  return false
})

var module_server_config = null;
var searchkey = '';
$('#browser_module_btn').on('click', function(){
  $.ajax({
    url: '/api/get_user_config',
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(config) {
    config = config.result
    if (config.module_server_url == undefined || config.module_server_url == '') {
      modal_alert('还没有配置模块库服务器地址')
      return false
    }  
    module_server_config = config

    var html = $(Handlebars.compile($("#browser_module_template").html())());

    var newmodalform = new modal_form({
      title: '浏览模块库',
      content: html,
      formid: 'browser_module_form',
      size: 'big'
    });

    newmodalform.show()
    
    $('#browser_module_form').submit(function(){
      newmodalform.close()
      return false
    })

    searchkey = ''
    bindSearchModule()

    getModulesFromServer(1, '', function(json){

    }, function(message){
      modal_alert(message)
    })   
  })
  .fail(function(error) {
    
  })
  return false
})

function showModulesFromServer(index) {
  
}

/**
 * 从模块服务器获取模块数据
 * 
 * @param {int} index 页号
 * @param {string} search 搜索字符串
 * @param {any} succ 成功回调
 * @param {any} fail 失败回调
 */
function getModulesFromServer(index, search, succ, fail) {
  if(index == undefined){
    index = 1
  }
  
  var pagesize = 6
  $.ajax({
    url: module_server_config.module_server_url + '/api/modules',
    type: 'GET',
    dataType: 'json',
    data: {
      pageindex: index,
      pagesize: pagesize,
      search: search
    }
  })
  .done(function(json) {
    if(!json.re){
      fail(json.message)
      return false
    }
    var html = $(Handlebars.compile($("#browser_module_list_template").html())(json.result));

    $('#module_list').html(html)

    if(json.result.count <= pagesize){
      $('#module_list_pager').hide()
      return false
    }
    $('#module_list_pager').show()
    var newpager = new pager({
      element_id: 'module_list_pager',
      count: json.result.count,
      pagesize: pagesize,
      pageindex: index
    })
    newpager.show()

    if(json.re){
      succ(json.result)
    } 
    else{
      fail(json.message)
    }    
  })
  .fail(function(error) {
    fail(json.message)
  })
}

function bindSearchModule() {
  $('#browser_module_form').on('click', '.panel', function(){
    let module_name = $(this).data('name')
    $.ajax({
      url: module_server_config.module_server_url + '/api/module/' + module_name,
      type: 'GET',
      dataType: 'json',
      data: {
        
      }
    })
    .done(function(json) {   
      json.module_server_url = module_server_config.module_server_url
      json.module_name = module_name
      var html = $(Handlebars.compile($("#module_info_template").html())(json));

      var newmodalform = new modal_form({
        title: '下载 <a href="' + module_server_config.module_server_url + '/modules/info/' + module_name + '" target="_blank">' + module_name + '</a> 模块？',
        content: html,
        formid: 'download_module_form',
      });

      newmodalform.show();

      $('#version_select').on('change', function(){
        var this_version = $(this).val()
        changeVersion(module_name, this_version)
      })

      $('#download_module_form').submit(function(){
        downloadModule(module_name, $('#version_select').val(), function(){
          modal_alert({
            content: '下载成功！',
            onClose: function(){
              newmodalform.close()
              reload_module_list()
            }
          })
        }, function(message){
          modal_alert('下载失败！ ' + message)
        })
        return false
      })
    })
    .fail(function(error) {
      
    })
 
    return false
  })

  $('#search_key').on('input', _.debounce(function(){
    let key = $.trim($(this).val())
    showSearch(key)
    return false
  }, 250))

  $('#clean_search').on('click', function(){
    $('#search_key').val('')
    showSearch('')
    return false
  })
  
  //绑定分页
  $('#module_list_pager').on('click', 'a', function(){
    var pageindex = $(this).data('page')
    getModulesFromServer(pageindex, searchkey, function(json){

    }, function(message){
      modal_alert(message)
    })  
  })
  
}

function showSearch(key) {
  searchkey = key
  getModulesFromServer(1, key, function(){
    
  }, function(message){
    modal_alert(message)
  })
  return false;
  $.ajax({
    url: module_server_config.module_server_url + '/api/modules',
    type: 'GET',
    dataType: 'json',
    data: {
      search: key
    }
  })
  .done(function(json) {   
    var html = $(Handlebars.compile($("#browser_modulelist_template").html())({
      modules: json,
      config: module_server_config
    }));

    $('#module_list').html(html)

  })
  .fail(function(error) {
    
  })   
}

/**
 * 
 * 更换版本
 * 
 */
function changeVersion(module_name, this_version) {
  $.ajax({
    url: module_server_config.module_server_url + '/api/module/' + module_name + '?version='+ this_version,
    type: 'GET',
    dataType: 'json',
    data: {
      
    }
  })
  .done(function(json) {
    json.module_server_url = module_server_config.module_server_url
    json.module_name = module_name
    var html = Handlebars.compile($("#module_info2_template").html())(json);
    $('#module_info2').html(html);
  })
  .fail(function(error) {
    alert('获取模块信息失败')
  })
}

/**
 * 下载模块
 * 
 * @param {any} module_name 模块名字
 * @param {any} module_version 模块版本
 */
function downloadModule(module_name, module_version, succ, fail) {
  $.ajax({
    url: '/page/download_module',
    type: 'POST',
    dataType: 'json',
    data: {
      module_name: module_name,
      module_version: module_version
    }
  })
  .done(function(json) {   
    if(json.re){
      succ()
    }
    else{
      fail(json.message)
    }
  })
  .fail(function(error) {
    fail(error.message)
  })
}