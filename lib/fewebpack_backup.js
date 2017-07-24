/**
 * 编译webpack
 */
const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const path = require('path');
let files = require('./files');
let fs = new MemoryFS();

var fewebpack = {
  init: function () {
    let pagejs = files.getPageJs();
    if (pagejs.length == 0) {
      return false;
    }
    let webpackconfig_entry = {};
    pagejs.forEach(v => {
      webpackconfig_entry[v.name] = './page/' + v.name + '/' + v.name + '.js';
    });

    let commonjs = files.getCommonJs();
    commonjs.forEach(v => {
      webpackconfig_entry[v.name] = './common/' + v.filename;
    });

    let compiler = webpack({
      // 配置对象
      entry: webpackconfig_entry,
      output: {
        path: path.join(global.workdir, 'bundle/js'),
        publicPath: '/js',
        filename: '[name].js'
      },
      resolveLoader:{
        alias: {
          "style-loader": path.join(global.appdir, 'node_modules', 'style-loader'),
          "css-loader": path.join(global.appdir, 'node_modules', 'css-loader'),
          "less-loader": path.join(global.appdir, 'node_modules', 'less-loader'),
          "file-loader": path.join(global.appdir, 'node_modules', 'file-loader')
        }
      },
      module: {
        rules: [{
          test: /\.less$/,
          use: [{
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "less-loader", // compiles Less to CSS
            options:{
              noIeCompat: false
            }
          }]
        },{
          test: /\.(png|jpg|gif|jpeg)$/,
          use: [{
            loader: "file-loader",
            options: {
              //outputPath: '/css/img/'
              publicPath: 'css/img/'
              //name: '[name]'
            }
          }]
        }]
      }

    });

    compiler.outputFileSystem = fs;

    let watching = this.watching = compiler.watch({
      /* watchOptions */
    }, (err, stats) => {
      // 在这里打印 watch/build 结果...
      //console.log(stats);
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      // const info = stats.toJson();
      // console.info(info);
      stats.toJson().assets.forEach(v=>{
        console.info(v);
      });

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings)
      }

      // let content = fs.readFileSync(path.join(global.workdir, 'bundle/js/index.js'), 'utf-8');
      // console.info(content);
    });
  },
  stop: function () {
    return new Promise(function (resolve) {
      if (this.watching != undefined) {
        this.watching.close(() => {
          //console.log("Watching Ended.");
          resolve();
        });
      } else {
        resolve();
      }
    }.bind(this));
  },
  readPageJS: function (pagename) {
    return fs.readFileSync(path.join(global.workdir, 'bundle/js/' + pagename + '.js'), 'utf-8');
  },
  readCommonJS: function (pagename) {
    return fs.readFileSync(path.join(global.workdir, 'bundle/js/' + pagename + '.js'), 'utf-8');
  },
  readCssBgimg: function (imgname) {
    return fs.readFileSync(path.join(global.workdir, 'bundle/js/' + imgname));
  }
}

module.exports = fewebpack;