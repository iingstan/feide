
$('#header_nav>li:eq(1)').addClass('active');

/**
 * 组件列表
 */
$.ajax({
    url: '/api/components_list',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      var html = Handlebars.compile($("#components_list_template").html())(json.result);
      $('#components_list').html(html);
    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });