#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
let path = require('path')

global.workdir = process.cwd(); //工作目录
global.appdir = __dirname; //程序目录

if (argv.v) {
  let jsonfile = require('jsonfile');
  console.log(jsonfile.readFileSync(path.join(global.appdir, 'package.json')).version)
  return false;
}

//没有找到配置文件，初始化项目
let files = require('./lib/files');
let manage_server = require('./lib/manage_server');
if(!files.exists('./feide.config.json')){ 
  let rndport = 8000 + Math.floor(Math.random()*999+1);
  manage_server(rndport).then(function(){
    let opn = require('opn');
    opn('http://localhost:' + rndport + '/init/', {
      app: 'chrome'
    });
  });
  return false;
}


let memory_file = require('./lib/memory_file')
memory_file.data = {}; //内存文件


const jsonfile = require('jsonfile');
global.config = jsonfile.readFileSync('./feide.config.json'); //项目设置


const file_make = require('./lib/file_watch/file_make');
const file_watch = require('./lib/file_watch/file_watch')
file_make.makeSprite() //编译sprite
file_watch.watch_sprite.start() //监视sprite

const fewebpack = require('./lib/fewebpack')
fewebpack.start()
file_watch.watch_webpackjs.start()
// file_watch.watch_webpackjs.start(()=>{
//   // fewebpack.stop().then(()=>{
//   //   setTimeout(function() {
//   //     fewebpack.start()
//   //   }, 200);
//   // })
//   fewebpack.restart()
// })

//打开管理网站
manage_server(global.config.manage_server_port).then(()=>{
  let opn = require('opn');
  opn('http://localhost:' + global.config.manage_server_port + '/', {
    app: 'chrome'
  });
})

//设置模块服务器地址到用户数据
const module_server = require('./lib/module_server')
module_server.pathInit()
