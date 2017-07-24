/**
 * 模态框 表单
 */

function modal_form(options) {
    this.options = $.extend({
        title: '提示',
        formid: '',
        content: '',
        onClose: null
    }, options);
}

modal_form.prototype.show = function () {
    var html = this.html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><form action="" id="' + this.options.formid + '"><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default form_cancel_btn"><span class="fui-cross"></span> 取消</button><button type="submit" class="btn btn-primary form_submit_btn"><span class="fui-check"></span> 确定</button></div></form></div></div></div>');
    $('.modal-body', html).append(this.options.content);
    $("body").append(html);
    html.modal('show');

    // html.on('click', '.form_submit_btn', function(){
    //     html.modal('hide');
    // });

    html.on('click', '.form_cancel_btn', function(){
        html.modal('hide');
    });    

    html.on('hidden.bs.modal', function (e) {
        html.remove();
        if(this.options.onClose){
            this.options.onClose();
        }
    }.bind(this));
};

modal_form.prototype.close = function(){
  this.html.modal('hide');
}


module.exports = modal_form