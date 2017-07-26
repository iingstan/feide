/**
 * 发布
 */
const path = require("path");
let files = require('./files');
const fs = require('fs');
const mkdirp = require('mkdirp');
let fehbs = require('../lib/fehbs');
let fewebpack = require('../lib/fewebpack');
let file_make = require('../lib/file_watch/file_make');
var UglifyJS = require("uglify-js");
const glob = require('glob')
const log = require('./log')
const memory_file = require('./memory_file')
let mfs = require('./memoryfs')
var CleanCSS = require('clean-css');


var publish = {
  /**
   * 发布
   * 
   * @param {string} config 发布配置 
   * @param {function} callback 发布成功回调 
   */
  publish(config) {
    return new Promise(function (resolve, reject) {
      let publish_promise_list = [
        this.publishJs(config),
        this.publishLibsJs(config),
        this.publishCss(config),
        this.publishLibsCss(config),
        this.publishSprite(config),
        this.publishPublicFile(config),
        this.publishModuleFile(config)
      ]

      if (config.publish_page) {
        publish_promise_list.push(this.publishPage(config))
      }
      log.log('开始发布 目标位置' + config.publish_folder)
      Promise.all(publish_promise_list).then(function () {
        log.log('发布全部成功', 'green')
        resolve();
      }).catch(function (error) {
        log.log('发布失败', 'red')
        console.error(error)
        reject(error);
      });
    }.bind(this));
  },

  publishJs(config) {
    return new Promise(function (resolve, reject) {
      let jss = files.getPageJs();
      mkdirp(path.join(config.publish_folder, 'js'), function (err) {
        if (err) {
          reject(err);
          return false;
        }


        jss.forEach(v => {
          let jscontent = fewebpack.readJS(v.name)

          if (config.publish_compress) {
            let uglifyjs_option = {}
            if (true) {
              uglifyjs_option = {
                ie8: true,
                sourceMap: {
                  url: v.name + ".js.map",
                  includeSources: true
                }
              }
            }

            var uglifyjs_result = UglifyJS.minify(jscontent, uglifyjs_option);
            if (uglifyjs_result.error != undefined) {
              log.log('压缩js失败！ ' + uglifyjs_result.error.message, 'red')
              reject(uglifyjs_result.error)
            }
            else {
              fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js'), uglifyjs_result.code, 'utf-8');
              if(true){
                let mapfile = uglifyjs_result.map
                mapfile = mapfile.replace('"sources":["0"]', '"sources":["' + v.name + '.js"]')
                fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js.map'), mapfile, 'utf-8')
              }
            }
          }
          else {
            fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js'), jscontent, 'utf-8')
          }

        });
        resolve();
      });
    });
  },


  publishLibsJs(config) {
    return new Promise(function (resolve, reject) {
      let jss = files.getLibsJs();
      if (jss.length > 0) {
        mkdirp(path.join(config.publish_folder, 'js'), function (err) {
          if (err) {
            reject(err);
            return false;
          }
          let output = files.getLibsJsContent();//UglifyJS

          let uglifyjs_option = {}


          if (config.publish_compress) {
            if (true) {
              
              uglifyjs_option = {
                ie8: true,
                sourceMap: {
                  url: "libs.js.map",
                  includeSources: true
                }
              }
            }

            var uglifyjs_result = UglifyJS.minify(output, uglifyjs_option);
            if (uglifyjs_result.error != undefined) {
              reject(result.error)
            }
            else {
              fs.writeFileSync(path.join(config.publish_folder, 'js', 'libs.js'), uglifyjs_result.code, 'utf-8');
              if(true){
                let mapfile = uglifyjs_result.map
                mapfile = mapfile.replace('"sources":["0"]', '"sources":["libs.js"]')
                fs.writeFileSync(path.join(config.publish_folder, 'js', 'libs.js.map'), mapfile, 'utf-8')
              }
            }
          }
          else {
            fs.writeFileSync(path.join(config.publish_folder, 'js', 'libs.js'), output, 'utf-8');
          }


          resolve();
        });
      }
      else {
        resolve();
      }
    });
  },

  publishCss(config) {
    return new Promise(function (resolve, reject) {
      let csss = files.getPageLess();
      mkdirp(path.join(config.publish_folder, 'css'), function (err) {
        if (err) {
          reject(err);
          return false;
        }

        let css_options = { compatibility: 'ie7' }
        if (global.config) {
          if (global.config.css_compress_ie) {
            css_options.compatibility = global.config.css_compress_ie
          }
        }

        Promise.all(csss.map(v => file_make.compileStyle(v.path))).then(result => {
          result.forEach((v, i) => {
            let output = '';
            if (config.publish_compress) {
              output = (new CleanCSS(css_options).minify(v)).styles;
              //console.info(output);
            }
            else {
              output = v
            }

            fs.writeFileSync(path.join(config.publish_folder, 'css', csss[i].name + '.css'), output, 'utf-8');
          });
          resolve();
        }).catch(error => {
          reject(error)
        });

      });
    });
  },


  publishLibsCss(config) {
    return new Promise(function (resolve, reject) {
      let csss = files.getLibsCss();
      if (csss.length > 0) {
        mkdirp(path.join(config.publish_folder, 'css'), function (err) {
          if (err) {
            reject(err);
            return false;
          }
          let output = files.getLibsCssContent();
          fs.writeFileSync(path.join(config.publish_folder, 'css', 'libs.css'), output, 'utf-8');
          resolve();
        });
      }
      else {
        resolve();
      }
    });
  },

  publishPage(config) {
    return new Promise(function (resolve, reject) {
      let pages = files.getPageHbs();
      mkdirp(config.publish_folder, function (err) {
        if (err) {
          reject(err);
          return false;
        }
        pages.forEach(v => {
          let output = fehbs.compile(v.path);
          fs.writeFileSync(path.join(config.publish_folder, v.name + '.html'), output, 'utf-8');
        });
        resolve();
      });
    });
  },

  publishSprite(config) {
    return new Promise(function (resolve, reject) {
      if (memory_file.sprite_img == undefined) {
        resolve()
        return false
      }

      files.writeFileSync(path.join(config.publish_folder, 'css', 'img', 'sprites.png'), memory_file.sprite_img);
      resolve()
    })
  },

  publishPublicFile(config) {
    log.log('开始发布public文件夹')
    return new Promise(function (resolve, reject) {
      glob('public/**/*.*', function (error, public_files) {
        if (error != undefined) {
          reject(error)
        }

        public_files.forEach(v => {
          files.copyFile(v, path.join(config.publish_folder, v.substring(7)))
          log.log('复制 ' + v + ' 成功', 'green')
        })
        resolve()
      })
    })
  },

  publishModuleFile(config) {
    return new Promise(function (resolve, reject) {
      //mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'img', imgname))
      mfs.readdir(path.join(global.workdir, 'bundle', 'js', 'img'), function (error, result) {
        if (error != null) {
          if(error.errno == 34){
            resolve()
          }
          else{
            reject(error)
          }
        }
        else {
          result.forEach(v => {
            let content = mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'img', v))
            files.writeFileSync(path.join(config.publish_folder, 'css', 'img', v), content)
            resolve()
          })
        }
      })
    })
  }
}


module.exports = publish;