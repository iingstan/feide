/**
 * 分页
 */


var pager = (function () {
  function pager(options) {
      var defaultoptions = {
          element_id: null,
          count: 500,
          pagesize: 20,
          pageindex: 1
      }
      this.options = $.extend(defaultoptions, options);
  }

  pager.prototype.show = function () {
      if (this.options.count == 0) {
          $('#' + this.options.element_id).html('');
          return false;
      }
      var count = Math.ceil(this.options.count / this.options.pagesize);
      var html = ['<ul class="pagination">'];
      var pageindex = this.options.pageindex;

      // 上一页页码
      var prev_num = 1;
      if(pageindex > 1){
          prev_num = pageindex - 1;
      }
      // 下一页页码
      var next_num = count;
      if(pageindex < count){
          next_num = pageindex + 1;
      }

      html.push('<li class="previous"><a href="javascript:;" data-page="1" class="btn btn-default"><span class="glyphicon glyphicon-fast-backward"></span></a></li><li><a href="javascript:;" class="btn btn-default" data-page="' + prev_num + '"><span class="fui-arrow-left"></span></a></li>');

      if (pageindex < 4) {
          //前五个
          for (var i = 1; i <= count; i++) {
              if(i > 5){
                  break;
              }
              html.push('<li');
              if (i == pageindex) {
                  html.push(' class="active"');
              }
              html.push('><a href="javascript:;" data-page="' + i + '">' + i + '</a></li>');
          };
      }
      else if(pageindex > count - 3){
          for (var i = (count - 4 > 0) ? count - 4 : 1; i <= count; i++) {
            html.push('<li');
            if (i == pageindex) {
                html.push(' class="active"');
            }
            html.push('><a href="javascript:;" data-page="' + i + '">' + i + '</a></li>');
          };
      }
      else{
          for (var i = pageindex -2; i <= pageindex + 2; i++) {
              html.push('<li');
              if (i == pageindex) {
                  html.push(' class="active"');
              };
              html.push('><a href="javascript:;" data-page="' + i + '">' + i + '</a></li>');
          };
      }

      html.push('<li><a href="javascript:;" class="btn btn-default" data-page="' + next_num + '"><span class="fui-arrow-right"></span></a></li><li class="next"><a href="javascript:;" class="btn btn-default" data-page="' + count + '"><span class="glyphicon glyphicon-fast-forward"></span></a></ul></li>');

      $('#' + this.options.element_id).html(html.join(''));
  };
  return pager;
})();

module.exports = pager;