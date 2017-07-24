/**
 * 文件变动监视
 */
const log = require('../log');
const chokidar = require('chokidar')
let file_make = require('./file_make')
let _ = require('lodash')
let fewebpack = require('../fewebpack')

let file_watch = {}

//watch sprite
file_watch.watch_sprite = {
  start(){
    this.watch = chokidar.watch('./css/_sprite/*.{jpg,png,gif}', {
      //ignored: /node_modules|\.git/,
      persistent: true,
      ignoreInitial: true
    });
    this.watch.on('all', function(event, filepath) {
      log.log('文件变动 ' + event + ' ' + filepath, 'yellow')
      file_make.makeSprite()
      //unlink add change


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
      log.log('开始监视./css/_sprite/*.{jpg,png,gif}')
    })
  },
  stop(){
    this.watch.close()
  }
}

file_watch.watch_webpackjs = {
  start(callback){
    this.watch = chokidar.watch('./js/*.{js,jsx,ts,tsx}', {
      //ignored: /node_modules|\.git/,
      persistent: true,
      ignoreInitial: true
    });
  //   this.watch.on('all', (event, filepath)=> {
      
  //     if(event == 'add' || event == 'unlink'){
  //       log.log('监听到文件变动 ' + event + ' ' + filepath, 'yellow')
  //       _.debounce(this.restart, 500)   
  //       //this.restart()    
  //     }

  //   }).on('ready', function() {
  //     log.log('开始监听./js/*.{js,jsx,ts,tsx}文件变动')
  //   })
  // },
    this.watch.on('all', (event, filepath)=>{
      if(event == 'add' || event == 'unlink'){
        log.log('监听到文件变动 ' + event + ' ' + filepath, 'yellow')
        this.restart()
      }
    }).on('ready', function() {
      log.log('开始监听./js/*.{js,jsx,ts,tsx}文件变动')
    })
  },
  stop(){
    this.watch.close()
  },
  restart(){
    fewebpack.restart()
    // fewebpack.stop()
    // setTimeout(function() {
    //   fewebpack.start()
    // }, 1000);
  }
}


module.exports = file_watch