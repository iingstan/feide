/**
 * 编译webpack
 */

const webpack = require("webpack");
const path = require('path');
let files = require('./files');
let mfs = require('./memoryfs')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/module/[id]-one.css');
const extractLESS = new ExtractTextPlugin({
  filename: 'css/module/[id]-two.css'
});
const memory_file = require('./memory_file')
const log = require('./log')
let _ = require('lodash')

var fewebpack = {
  start: function () {
    log.log('开启webpack')
    let _this = this

    this.watching = undefined

    let pagejs = files.getPageJs();

    if (pagejs.length == 0) {
      return Promise.resolve()
    }

    let webpackconfig_entry = {};
    pagejs.forEach(v => {
      if (v.path.indexOf('./') != 0) {
        v.path = './' + v.path
      }
      webpackconfig_entry[v.name] = v.path;
    });

    //console.info(webpackconfig_entry);

    return new Promise((resolve, reject) => {

      let webpack_config = {
        resolve: {
          modules: [
            path.join(global.workdir, 'js', 'modules')
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        // 配置对象
        entry: webpackconfig_entry,
        output: {
          path: path.join(global.workdir, 'bundle', 'js'),
          //publicPath: '/js',
          filename: '[name].js'
        },
        resolveLoader: {
          alias: {
            "style-loader": path.join(global.appdir, 'node_modules', 'style-loader'),
            "css-loader": path.join(global.appdir, 'node_modules', 'css-loader'),
            "less-loader": path.join(global.appdir, 'node_modules', 'less-loader'),
            "file-loader": path.join(global.appdir, 'node_modules', 'file-loader'),
            "babel-loader": path.join(global.appdir, 'node_modules', 'babel-loader'),
            "awesome-typescript-loader": path.join(global.appdir, 'node_modules', 'awesome-typescript-loader'),
            "raw-loader": path.join(global.appdir, 'node_modules', 'raw-loader'),
            "base64-image-loader": path.join(global.appdir, 'node_modules', 'base64-image-loader')
          }
        },
        module: {
          rules: [
          {
            test: /\.(hbs|txt|html)$/,
            use: 'raw-loader'
          },
          {
            test: /_base64\.(gif|png|jpg)$/,
            use: 'base64-image-loader'
          },  
          {
            test: /\.css$/,
            use: extractCSS.extract({
              fallback: "style-loader",
              use: "css-loader"
            })
          },
          {
            test: /\.less$/i,
            use: extractLESS.extract([{
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            }, {
              loader: 'less-loader',
              options: {
                sourceMap: false
              }
            }])
          },
          {
            test: /(!_base64)\.(png|jpg|gif|jpeg)$/,
            use: [{
              loader: "file-loader",
              options: {
                outputPath: 'img/',
                //publicPath: 'img'
                name: '[hash:10].[ext]'
              }
            }]
          },
          {
            test: /\.tsx?$/,
            use: [{
              loader: "awesome-typescript-loader",
              options: {
                configFileName: 'feide.config.json'
              }
            }]
          }
          ]
        },
        devtool: 'inline-source-map',
        plugins: [
          extractCSS,
          extractLESS
        ]
      }
      //js babel
      if (global.config.js_babel) {
        webpack_config.module.rules.push({
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              //sourceRoot: global.appdir
              filename: path.join(global.appdir, 'js')
            }
          }
        })
      }

      //console.info(webpack_config);

      let compiler = webpack(webpack_config);

      compiler.outputFileSystem = mfs;

      this.watching = compiler.watch({
        aggregateTimeout: 500,
        //poll: 1000,
        ignored: /(node_modules|bundle)/
      }, (error, stats) => {
        //console.info(stats.toJson("minimal"));
        if (error == null) {
          log.log('webpack编译成功', 'green')
          resolve()
        } else {
          log.log('webpack编译失败', 'red')
          reject(error)
        }

        _this.makeModuleStyleFile()

      });

      //console.info(this.watching);

      // this.watching = compiler.watch({}, _.debounce((error, stats) => {
      //   //console.info(stats.toJson("minimal"));
      //   if (error == null) {
      //     log.log('webpack编译成功', 'green')
      //     resolve()
      //   } else {
      //     log.log('webpack编译失败', 'red')
      //     reject(error)
      //   }

      //   _this.makeModuleStyleFile()

      // },	500));
    })

  },
  stop: function () {
    let _this = this
    return new Promise((resolve) => {
      if (this.watching != undefined) {
        _this.watching.close(() => {
          log.log('关闭webpack')
          //console.info(_this.watching);

          setTimeout(function () {
            resolve()
          }, 500)

        });
      } else {
        resolve();
      }
    });
  },
  /**
   * 重启webpack
   * 
   */
  restart() {
    log.log('重启webpack')
    return new Promise((resolve, reject) => {
      this.stop().then(() => {
        return this.start()
      }).then(() => {
        log.log('重启webpack成功', 'green')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  readJS: function (pagename) {
    //console.info(pagename)
    try {
      return mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', pagename + '.js'), 'utf-8')
    } catch (error) {
      //log.log(error.message, 'red')
      return null
    }
    //return ;
  },
  readCssBgimg: function (imgname) {
    return mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'img', imgname));
  },
  /**
   * 生成模块css文件
   */
  makeModuleStyleFile: function () {
    mfs.readdir(path.join(global.workdir, 'bundle', 'js', 'css', 'module'), function (error, result) {
      if (error != undefined) {
        if (error.errno == 34) {
          return false
        }
        log.log('模块Less生成失败！ ' + error.message, 'red')
        console.info(error);
        return false;
      }
      let modulestyle = [];
      //console.info(111);
      //console.info(result);
      result.forEach(v => {
        modulestyle.push('/*' + v + '*/\n')
        modulestyle.push(mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'css', 'module', v), 'utf-8'))
      })
      memory_file.modulestyle = modulestyle.join('')
      files.writeFileSync(path.join('css', '_partial', '_module_style.less'), memory_file.modulestyle)

    })
  },
  /**
   * 清除模块css文件
   */
  clearModuleStyleFile: function () {
    let files = mfs.readdirSync(path.join(global.workdir, 'bundle', 'js', 'css', 'module'))
    files.forEach(v => {
      mfs.unlinkSync(path.join(global.workdir, 'bundle', 'js', 'css', 'module', v))
    })
  }
}

module.exports = fewebpack;
