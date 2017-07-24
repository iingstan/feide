/**
 * 文件监听
 */

const fs = require('fs');
const path = require('path');
var chokidar = require('chokidar');
let fewebpack = require('./fewebpack');
const glob = require('glob');

let filewatch = {

  fileList(){
    
  },

  init(){

  },

  /**
   * 开始监听
   */
  start() {
    //console.info(111);
    this.watch = chokidar.watch('./**/*.*', {
      ignored: /node_modules|\.git/,
      persistent: true,
      ignoreInitial: true
      // followSymlinks: false,
      // useFsEvents: false,
      // usePolling: false
    });
    this.watch.on('all', function(event, filepath) {
      console.log(event, filepath)
      //console.log(event, filepath); //add change unlink
      // if(path.extname(filepath) == '.js'){
      //   console.info(event);
      //   console.info(filepath);
      // }

      // if(event == 'add' || event == 'unlink'){
      //   console.log(event, filepath);
      //   fewebpack.stop().then(function(){
      //     fewebpack.init();
      //   });
      // }
    }).on('ready', function() {
      //console.log('Ready');
    })
  },  
  /**
   * 停止监听
   * 
   */
  stop(){
    this.watch.close()
  }
}

module.exports = filewatch;