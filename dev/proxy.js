/**
 * 代理服务
 */
var modal_alert = require('./modules/modal_alert/modal_alert');

$('#header_nav>li:eq(2)').addClass('active');

$('#add_proxy_rule').on('click', function () {
  proxy_rule.add();
});

var proxy_rule = {
  add: function () {
    var html = Handlebars.compile($("#create_proxy_rule_template").html())({});
    $('#proxy_rules').append(html);
  },
  bind: function () {
    $('#proxy_rules').on('click', '.rule_moveup', function () {
      var thisrule = $(this).parents('.proxy_rules_item');
      var thisindex = thisrule.index();
      if (thisindex != 0) {
        $('.proxy_rules_item').eq(thisindex - 1).before(thisrule);
      }
    });
    $('#proxy_rules').on('click', '.rule_movedown', function () {
      var thisrule = $(this).parents('.proxy_rules_item');
      var thisindex = thisrule.index();
      if (thisindex != ($('.proxy_rules_item').length - 1)) {
        $('.proxy_rules_item').eq(thisindex + 1).after(thisrule);
      }
    });
    $('#proxy_rules').on('click', '.delete_rule', function () {
      if ($('.proxy_rules_item').length > 1) {
        $(this).parents('.proxy_rules_item').remove();
      } else {
        modal_alert({
          content: '最后一条规则不能删除！'
        });
      }

    });
  }
}

proxy_rule.add();
proxy_rule.bind();

$('#save_proxy').on('click', function () {
  var portnum = $('#portnum').val();
  var rules = [];
  $('.proxy_rules_item').each(function (i, v) {
    rules.push({
      route: $('.porxy_route', $(v)).val(),
      url: $('.porxy_url', $(v)).val()
    });
  });
  $.ajax({
      url: '/proxy/save',
      type: 'POST',
      dataType: 'json',
      data: {
        rules: JSON.stringify(rules),
        portnum: portnum
      }
    })
    .done(function (json) {
      if (json.re) {
        $('#save_proxy_tips').show();
        setTimeout(function () {
          $('#save_proxy_tips').hide();
        }, 3000);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
  return false;
});

$.ajax({
    url: '/proxy/getrules',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    console.info(json);
    if (json.re && json.result != null) {
      $('#portnum').val(json.result.proxy_port);
      if (json.result.proxy_rules.length > 1) {
        for (var i = 1; i < json.result.proxy_rules.length; i++) {
          proxy_rule.add();
        }
      }

      json.result.proxy_rules.forEach(function (v, i) {
        var item = $('.proxy_rules_item').eq(i);
        $('.porxy_route', item).val(v.route);
        $('.porxy_url', item).val(v.url);
      });

    }
  })
  .fail(function (error) {

  })
  .always(function () {

  });

$('#open_proxy_form').on('submit', function () {
  var portnum = $('#portnum').val();
  var rules = [];
  $('.proxy_rules_item').each(function (i, v) {
    rules.push({
      route: $('.porxy_route', $(v)).val(),
      url: $('.porxy_url', $(v)).val()
    });
  });
  console.info(rules);
  $.ajax({
      url: '/proxy/open',
      type: 'POST',
      dataType: 'json',
      data: {
        rules: JSON.stringify(rules),
        portnum: portnum
      }
    })
    .done(function (json) {
      console.info(json);
      if (json.re) {
        $('#open_proxy').prop('disabled', true);
        $('#close_proxy').prop('disabled', false);

        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', true);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
  return false;
});

$('#close_proxy').on('click', function () {
  $.ajax({
      url: '/proxy/close',
      type: 'GET',
      dataType: 'json',
      data: {

      }
    })
    .done(function (json) {
      if (json.re) {
        $('#open_proxy').prop('disabled', false);
        $('#close_proxy').prop('disabled', true);

        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', false);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
});

$.ajax({
    url: '/proxy/state',
    type: 'GET',
    dataType: 'json',
    data: {

    }
  })
  .done(function (json) {
    if (json.re) {
      if (json.result) {
        $('#open_proxy').prop('disabled', true);
        $('#close_proxy').prop('disabled', false);
        $('#portnum').add('.porxy_route').add('.porxy_url').add('.rule_moveup').add('.rule_movedown').add('.delete_rule').add('#add_proxy_rule').prop('disabled', true);
      }
    }
  })
  .fail(function (error) {

  })