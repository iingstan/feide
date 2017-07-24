/**
 * 根据文件内容生成内存数据
 */

const path = require('path');
const glob = require('glob');

const fs = require("fs");
const log = require('../log');
const fehbs = require('../fehbs')
const fewebpack = require('../fewebpack')
const spritesmith = require('spritesmith');
const tools = require('../tools');
const files = require('../files')
let memory_file = require('../memory_file')

let file_make = {
  makeAll() {
    this.makeLess()
    this.makeHbs()
    //this.makeJS()
    this.makeSprite()
  },

  getFileData(filepath) {

  },

  getLessFileList() {
    return new Promise(function (resolve, reject) {
      glob("./css/**/*.less", {
        ignore: './css/_partial/*.*'
      }, function (error, files) {
        if (error != null) {
          reject(error)
        }
        else {
          resolve(files)
        }
      })
    })
  },

  getHbsFileList() {
    return new Promise(function (resolve, reject) {
      glob('./page/**/*.hbs', {
        ignore: './page/{_partial,_layout}/**/*.*'
      }, function (error, files) {
        if (error != null) {
          reject(error)
        }
        else {
          resolve(files)
        }
      })
    })
  },

  getJsFileList() {
    return new Promise(function (resolve, reject) {
      glob('./js/**/*.js', {
        ignore: './js/modules/**/*.*'
      }, function (error, files) {
        if (error != null) {
          reject(error)
        }
        else {
          resolve(files)
        }
      })
    })
  },

  getSpriteFileList() {
    return new Promise(function (resolve, reject) {
      glob('./css/_sprite/*.{png,jpg,gif}', {
        //ignore: './js/modules/**/*.*'
      }, function (error, files) {
        if (error != null) {
          reject(error)
        }
        else {
          resolve(files)
        }
      })
    })
  },

  /**
   * 编译less文件
   * @param {string} filepath 文件路径
   */
  compileStyle(filepath) {
    log.log('编译' + filepath)

    if(path.extname(filepath) == '.less'){
      let less = require('less')
      return new Promise(function (resolve, reject) {
        let cssfile = fs.readFileSync(filepath, 'utf-8');
        less.render(cssfile, {
          filename: filepath,
          //sourceMap: {sourceMapURL: '111.less.map'}
        }, function (e, output) {
          //console.info(output.map)
          if (e != null) {
            log.log('编译' + filepath + '失败', 'red')
            console.info(e);
            reject(e);
          }
          else {
            log.log('编译' + filepath + '成功', 'green')
            resolve(output.css);
          }
        });
      });
    }

    if(path.extname(filepath) == '.scss'){
      let sass = require('node-sass');
      return new Promise((resolve, reject)=>{
        let cssfile = fs.readFileSync(filepath, 'utf-8');
        sass.render({
          data: cssfile,
          includePaths:[path.join(global.workdir, 'css')]
        }, function(e, result) { 
          if(e != null){
            log.log('编译' + filepath + '失败', 'red')
            console.info(e);
            reject(e);
          }
          else {
            log.log('编译' + filepath + '成功', 'green')
            resolve(result.css.toString());
          }
        })        
      })
    }

    if(path.extname(filepath) == '.css'){
      return new Promise((resolve, reject)=>{
        fs.readFile(filepath, 'utf-8', (err, data)=>{
          if(err != null){
            log.log('读取' + filepath + '失败', 'red')
            console.info(err);
            reject(err);
          }
          else {
            log.log('读取' + filepath + '成功', 'green')
            resolve(data);
          }
        })
      })
    }

    return Promise.reject(new Error("非style文件"))
  },

  makeHbs() {
    this.getHbsFileList().then(files => {
      files.forEach(v => {
        log.log('编译' + v);
        try {
          global.makefile[v] = fehbs.compile(v)
          log.log('编译完成' + v, 'green')
        } catch (error) {
          log.log('编译失败' + v + ' Error:' + error.message, 'red')
        }
      })
    }).catch(error => {
      log.log('Hbs编译失败！ ' + error.message, 'red')
    })
  },

  compileSprite(files) {
    return new Promise(function (resolve, reject) {
      spritesmith.run({
        src: files
      }, function handleResult(error, result) {
        //console.info(result);
        if (error == null) {
          resolve(result)
        }
        else {
          reject(error)
        }
      });
    });
  },

  makeSprite() {
    this.getSpriteFileList().then(sprites => {
      log.log('合并Sprite图片')
      this.compileSprite(sprites).then(result => {
        memory_file.sprite_img = result.image
        memory_file.sprite_css = this.coordinatesCss(result.coordinates)
        files.writeFileSync(path.join('css', '_partial', '_sprite.less'), memory_file.sprite_css)
        log.log('合并Sprite图片完成', 'green')
      }).catch(error => {
        log.log('合并Sprite图片失败 Error:' + error.message, 'red')
      })
    }).catch(error => {
      log.log('合并Sprite图片失败！ ' + error.message, 'red')
    })
  },

  coordinatesCss: function (coordinates) {
    var css = `
.icon{
  background: url(img/sprites.png) no-repeat 0 0;
  display: inline-block;
}`;
    Object.keys(coordinates).forEach(function (v, i) {
      let item = coordinates[v];
      let itemname = path.basename(v)
      css += `
.icon_${tools.getFilenameNoSuffixFromUrl(itemname)}{
  width: ${item.width}px;
  height: ${item.height}px;
  background-position: -${item.x}px -${item.y}px;
}`;
    });
    return css;
  }
}

module.exports = file_make