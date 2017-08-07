var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var jsonfile = require('jsonfile');
const _ = require('lodash')
const page_data = require('./page_data')


/**
 * 编译handlebars
 */
var fehbs = {
  /**
   * 编译页面文件
   * 
   * @param {string} pagepath 页面
   * @returns 
   */
  compile(pagepath) {
    this.regHelper();

    let pagefile = fs.readFileSync(pagepath, 'utf-8');
    let template = handlebars.compile(pagefile);
    let pagedata = page_data.get(pagepath);

    let pagelayout = pagedata.layout;
    if (pagelayout == undefined) {
      pagelayout = "";
    }

    if (pagelayout == "") { //如果没有layout
      return template(pagedata);
    }

    let layout_path = path.join('page', '_layout', pagelayout + '.hbs')
    let layoutfile = fs.readFileSync(layout_path, 'utf-8');
    let layout_template = handlebars.compile(layoutfile);

    var layout_data = page_data.get(layout_path);
    layout_data.body = template(pagedata);

    return layout_template(layout_data);
  },
  /**
   * 注册helper
   * 
   */
  regHelper() {
    var blocks = {};

    handlebars.registerHelper('partial', function (name, context) {
      let partial_path = path.join('page', '_partial', name + '.hbs')
      var partialhbs = fs.readFileSync(partial_path, 'utf-8');
      var template = handlebars.compile(partialhbs);
      let pagedata = page_data.get(partial_path);
      var result = template(pagedata);
      return new handlebars.SafeString(result);
    });

    handlebars.registerHelper('extend', function (name, context) {
      var block = blocks[name];
      if (!block) {
        block = blocks[name] = [];
      }
      block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    });

    handlebars.registerHelper('block', function (name, context) {
      var val = (blocks[name] || []).join('\n');

      if (context.fn && val === '') {
        return context.fn(this)
      }

      // clear the block
      blocks[name] = [];
      return val;
    });
  }
}

module.exports = fehbs;