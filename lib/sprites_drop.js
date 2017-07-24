/**
 * 雪碧图
 */

var Spritesmith = require('spritesmith');
var fs = require('fs');
var path = require('path');
var tools = require('./tools');
let files = require('./files');

module.exports = {
  /**
   * 获取合并图
   */
  getMergeImg: function (callback) {
    var sprites = this.getSpriteList();
    if(sprites.length == 0){
      callback('');
      return false;
    }
    Spritesmith.run({
      src: sprites
    }, function handleResult(err, result) {
      //console.info(result);
      callback(result.image);
      
      //result.image; // Buffer representation of image
      //result.coordinates; // Object mapping filename to {x, y, width, height} of image
      //result.properties; // Object with metadata about spritesheet {width, height}
      //fs.writeFileSync(__dirname + '/alt-diagonal.png', result.image);
    });
  },
  makeCss: function(coordinates){
    var css = `
.icon{
  background: url(img/sprites) no-repeat 0 0;
  display: inline-block;
}`;
    Object.keys(coordinates).forEach(function(v, i){
      let item = coordinates[v];
      css += `
.icon_${tools.getFilenameNoSuffixFromUrl(v)}{
  width: ${item.width}px;
  height: ${item.height}px;
  background-position: -${item.x}px -${item.y}px;
}`;
    });
    return css;
  },
  getMergeCss: function (callback) {
    var _this = this;
    var sprites = this.getSpriteList();
    if(sprites.length == 0){
      callback('');
      return false;
    }
    Spritesmith.run({
      src: sprites
    }, function handleResult(err, result) {
      //console.info(result);
      
      callback(_this.makeCss(result.coordinates));
      
      //result.image; // Buffer representation of image
      //result.coordinates; // Object mapping filename to {x, y, width, height} of image
      //result.properties; // Object with metadata about spritesheet {width, height}
      //fs.writeFileSync(__dirname + '/alt-diagonal.png', result.image);
    });
  },  
  getSpriteList: function () {
    var pagelist = files.readDirectory(path.join(global.workdir, 'css', '_sprite'));
    var result = [];
    if(pagelist != null){
      pagelist.forEach(function (v) {
        var stat = fs.lstatSync(path.join(global.workdir, 'css','_sprite', v));
        if (stat.isFile()) {
          result.push(path.join(global.workdir, 'css','_sprite', v));
        }
      });      
    }

    return result;
  }
}