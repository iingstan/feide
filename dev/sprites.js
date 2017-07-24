$('#header_nav>li:eq(0)').addClass('active');

/**
 * sprites列表
 */

function get_sprites_list() {
  $.ajax({
      url: '/page/sprites_list',
      type: 'GET',
      dataType: 'json',
      data: {

      }
    })
    .done(function (json) {
      if (json.re) {
        var data = json.result;

        if(data.length == 0){
          $('#sprite_img').hide()
          $('#sprite_less').hide()
        }

        data.map(function(v, i){
          if( i % 6 === 0 ){
            v.showh = true
          }
          else{
            v.showh = false;
          }

          if( i % 6 === 5 ){
            v.showb = true
          }
          else{
            v.showb = false;
          }

          if(v.filename.lastIndexOf('.') > 0){
            v.filename2 = v.filename.substring(0, v.filename.lastIndexOf('.'));
          }
          else{
            v.filename2 = v.filename;
          }
        });
        var html = Handlebars.compile($("#sprites_list_template").html())(data);
        $('#sprites_list').html(html);
      }
    })
    .fail(function (error) {

    })
    .always(function () {

    });
}
get_sprites_list();


  $.ajax({
      url: '/page/sprite_mergecss',
      type: 'GET',
      dataType: 'text',
      data: {

      }
    })
    .done(function (text) {
      $('#csspre').text(text);
      $('#csspre').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    })
    .fail(function (error) {

    })
    .always(function () {

    });


$('#sprites_list').on('focus', '.icon_code', function(){
  $(this).select();
})