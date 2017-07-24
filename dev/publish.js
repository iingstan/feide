/**
 * 发布页面js
 */
var modal_confirm = require('./modules/modal_confirm/modal_confirm');
var modal_alert = require('./modules/modal_alert/modal_alert');

$('#header_nav>li:eq(1)').addClass('active');

var config = null;

function get_publish_list() {
  $.ajax({
    url: '/api/get_config',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      config = json.result;
    }
  })
  .fail(function (error) {

  })
}

get_publish_list();


$('#create_publish_btn').on('click', function () {
  var html = $($("#create_publish_template").html());
  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#create_publish_form').on('submit', function () {
    create_publish(function () {
      self.location.reload();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
});

function create_publish(success, fail) {
  var publish_name = $.trim($('#publish_name').val());
  var publish_folder = $.trim($('#publish_folder').val());
  var publish_page = $('#publish_page').is(":checked");
  var publish_datefolder = $('#publish_datefolder').is(":checked");
  var publish_delete_file = $('#publish_delete_file').is(":checked");
  var publish_compress = $('#publish_compress').is(":checked");

  $.ajax({
    url: '/api/create_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      publish_name: publish_name,
      publish_folder: publish_folder,
      publish_page: publish_page,
      publish_datefolder: publish_datefolder,
      publish_delete_file: publish_delete_file,
      publish_compress: publish_compress
    }
  })
    .done(function (json) {
      //console.info(json);
      if (json.re) {
        if (success) {
          success();
        }
      }
      else {
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

$('.delete_publish_btn').on('click', function () {
  var index = $(this).data('index');
  modal_confirm({
    content: '确定要删除吗？',
    onConfirm: function () {
      delete_publish(index);
    }
  });
  return false;
});

/**
 * 删除发布配置
 * 
 * @param {any} index 
 */
function delete_publish(index) {
  $.ajax({
    url: '/api/delete_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index
    }
  })
    .done(function (json) {
      if (json.re) {
        self.location.reload();
      }
      else {
        modal_alert({
          content: "删除失败！ " + json.message
        });
      }
    })
    .fail(function (error) {
      modal_alert({
        content: "删除失败！ " + error.message
      });
    })
    .always(function () {

    });
};


$('.edit_publish_btn').on('click', function () {
  var index = $(this).data('index');

  var html = $(Handlebars.compile($("#edit_publish_template").html())(config.publish[index]));

  $('body').append(html);
  html.modal('show');
  $('[data-toggle="tooltip"]', html).tooltip();

  html.on('hidden.bs.modal', function (e) {
    html.remove();
  });

  $('#edit_publish_form').on('submit', function () {
    edit_publish(index, function () {
      self.location.reload();
    }, function (message) {
      modal_alert(message);
    });
    return false;
  });
  return false;
});



/**
 * 修改发布配置
 * 
 * @param {any} index 
 */
function edit_publish(index, success, fail) {
  var publish_name = $.trim($('#publish_name').val());
  var publish_folder = $.trim($('#publish_folder').val());
  var publish_page = $('#publish_page').is(":checked");
  var publish_datefolder = $('#publish_datefolder').is(":checked");
  var publish_delete_file = $('#publish_delete_file').is(":checked");
  var publish_compress = $('#publish_compress').is(":checked");

  $.ajax({
    url: '/api/edit_publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index,
      publish_name: publish_name,
      publish_folder: publish_folder,
      publish_page: publish_page,
      publish_datefolder: publish_datefolder,
      publish_delete_file: publish_delete_file,
      publish_compress: publish_compress
    }
  })
    .done(function (json) {
      //console.info(json);
      if (json.re) {
        if (success) {
          success();
        }
      }
      else {
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

$('.publish_publish_btn').on('click', function () {
  var index = $(this).data('index');

  $.ajax({
    url: '/publish/publish',
    type: 'POST',
    dataType: 'json',
    data: {
      index: index
    }
  })
  .done(function (json) {
    if(json.re){
      modal_alert('发布成功！');
    }
    else{
      modal_alert('发布失败！' + json.message);
    }
  })
  .fail(function (error) {
    modal_alert(error.message);
  })
  .always(function () {

  });


  return false;
});