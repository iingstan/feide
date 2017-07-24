/**
 * page/page
 */
var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_form = require('./modules/modal/modal_form');
var delete_file_confirm =  require('./modules/modal_confirm/delete_file_confirm');

$('#header_nav li:eq(0)').addClass('active');


/**
 * 页面列表
 */
function get_page_list() {
  $.ajax({
    url: '/page/pagelist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#pagelist_template").html())(json.result);
      $('#pagelist').html(html);
    }
  })
  .fail(function (error) {

  });  
}
get_page_list();


/**
 * 母版页列表
 * 
 */
function get_layout(callback) {
  $.ajax({
    url: '/page/layoutlist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      callback(json.result);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });
}

function get_layout_list() {
  get_layout(function(data){
    var html = Handlebars.compile($("#layoutlist_template").html())(data);
    $('#layoutlist').html(html);
  });   
}

get_layout_list()

/**
 * 新建母版页
 */
$('#create_layout_btn').on('click', function () {
  var html = $($("#create_layout_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_layout_form').on('submit', function () {
    create_layout(function () {
      html.modal('hide');
      get_layout_list();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});


/**
 * 新建母版页
 * 
 * @param {any} success 成功回调
 * @param {any} fail 失败回调
 */
function create_layout(success, fail) {
  var layout_name = $.trim($('#layout_name').val());

  $.ajax({
      url: '/page/create_layout',
      type: 'POST',
      dataType: 'json',
      data: {
        layout_name: layout_name
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
    .always(function () {

    });
};

/**
 * 局部页列表
 */
function get_partial() {
  $.ajax({
    url: '/page/partiallist',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#partiallist_template").html())(json.result);
      $('#partiallist').html(html);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });
}

get_partial(); 


/**
 * 新建局部页
 */
$('#create_partial_btn').on('click', function () {
  var html = $($("#create_partial_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_partial_form').on('submit', function () {
    create_partial(function () {
      html.modal('hide');
      get_partial();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});

/**
 * 新建局部页
 * 
 * @param {any} success 成功回调
 * @param {any} fail 失败回调
 */
function create_partial(success, fail) {
  var partial_name = $.trim($('#partial_name').val());

  $.ajax({
      url: '/page/create_partial',
      type: 'POST',
      dataType: 'json',
      data: {
        partial_name: partial_name
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
    .always(function () {

    });
};


/**
 * 新建页面
 */
$('#create_page_btn').on('click', function () {
  get_layout(function(layouts){
    var html = $(Handlebars.compile($("#create_page_template").html())({
      layouts: layouts
    }));
    $('body').append(html);
    html.modal('show');

    //console.info($('.flat_checkbox', html).length);
      $('.flat_checkbox', html).radiocheck();
      //$(':checkbox').radiocheck();

    $('#page_layout').select2();
    $('[data-toggle="tooltip"]', html).tooltip();

    html.on('hidden.bs.modal', function (e) {
      html.remove();
    });

    setTimeout(function(){
      $('#page_name').focus()
    },500)

    $('#create_page_form').on('submit', function () {
      create_page(function () {
        get_page_list();
        html.modal('hide');
      }, function (message) {
        console.info(message);
        modal_alert(message);
      });
      return false;
    });    
  });
});

function create_page(success, fail) {
  var page_name = $.trim($('#page_name').val());
  var extra_js = $('#extra_js').is(":checked");
  var extra_less = $('#extra_less').is(":checked");
  var page_layout = $('#page_layout').val();

  if(page_name == 'libs' && (extra_js || extra_less)){
    modal_alert('不要建立名为libs的js和css文件，会和系统的libs文件冲突')
    return false
  }

  $.ajax({
      url: '/page/create_page',
      type: 'POST',
      dataType: 'json',
      data: {
        page_name: page_name,
        extra_js: extra_js,
        extra_less: extra_less,
        page_layout: page_layout
      }
    })
    .done(function (json) {
      //console.info(json);
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
    .always(function () {

    });
}

/**
 * 修改页面数据
 */
$('body').on('click', '.page_data_btn', function(){
  var pagepath = $(this).data('path');
  var filename = $(this).data('filename');
  $.ajax({
    url: '/page/get_page_data',
    type: 'GET',
    dataType: 'json',
    data: {
      pagepath : pagepath
    }
  })
  .done(function(json) {
    var html = $(Handlebars.compile($("#pagedata_template").html())({
      filename: filename
    }));
    $('#page_data', html).val(JSON.stringify(json.result));

    var modypagedata_formmodal = new modal_form({
      title: filename + '页面数据',
      formid: 'edit_pagedata_form',
      content: html
    });
    modypagedata_formmodal.show();

    $('#edit_pagedata_form').on('submit', function () {
      let data = $('#page_data', html).val();
      if($.trim(data) == ''){
        modal_alert('不能为空！');
        return false;
      }
      try {
        data = JSON.parse(data);
      } catch (error) {
        modal_alert('json格式化不正确！');
        return false;
      }
      mody_page_data(pagepath, data, function () {
        modypagedata_formmodal.close()
      }, function (message) {
        modal_alert(message);
      });
      return false;
    });   
  })
  .fail(function(error) {
    
  });
  return false;
});

/**
 * 修改页面数据
 */
function mody_page_data(filepath, data, succ, fail) {
  data = JSON.stringify(data);
  $.ajax({
    url: '/page/save_page_data',
    type: 'POST',
    dataType: 'json',
    data: {
      pagepath: filepath,
      pagedata: data
    }
  })
  .done(function(json) {
    if (json.re) {
      succ();
    } 
    else{
      fail(json.message);
    }  
    
  })
  .fail(function(error) {
    fail(error.message);
  })
  .always(function() {
    
  });
}




/**
 * 修改页面母版页
 */
$('body').on('click', '.change_layout_btn', function(){
  var pagepath = $(this).data('path');
  var filename = $(this).data('filename');
  $.ajax({
    url: '/page/layoutlist',
    type: 'GET',
    dataType: 'json',
    data: {
    }
  })
  .done(function(json) {
    var html = $(Handlebars.compile($("#page_layout_template").html())({
      layouts: json.result
    }));

    var layout_formmodal = new modal_form({
      title: '选择' + filename + '母版页',
      formid: 'page_layout_form',
      content: html
    });
    layout_formmodal.show();

    $.ajax({
      url: '/page/get_page_data',
      type: 'GET',
      dataType: 'json',
      data: {
        pagepath : pagepath
      }
    })
    .done(function(json) {   
      if(json.result.layout != undefined){
        $('#page_layout', html).val(json.result.layout);
      }
      else{
        $('#page_layout', html).val('');
      }
      $('#page_layout', html).select2();
    })
    .fail(function(error) {
      
    })
    .always(function() {
      
    });

    
    

    $('#page_layout_form').on('submit', function () {
      let layout = $('#page_layout', html).val();

      mody_page_layout(pagepath, layout, function () {
        layout_formmodal.close()
      }, function (message) {
        modal_alert(message);
      });
      return false;
    });   
  })
  .fail(function(error) {
    
  });
  return false;
});

/**
 * 修改页面母版页
 */
function mody_page_layout(filepath, layout, succ, fail) {
  $.ajax({
    url: '/page/mody_page_layout',
    type: 'POST',
    dataType: 'json',
    data: {
      layout: layout,
      pagepath: filepath
    }
  })
  .done(function(json) {
    if (json.re) {
      succ();
    } 
    else{
      fail(json.message);
    }  
    
  })
  .fail(function(error) {
    fail(error.message);
  })
  .always(function() {
    
  });
}

delete_file_confirm.bind('.delete_page_btn', function(){
  get_page_list();
})
delete_file_confirm.bind('.delete_layout_btn', function(){
  get_layout_list();
})
delete_file_confirm.bind('.delete_partial_btn', function(){
  get_partial();
})