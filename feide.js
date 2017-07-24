#!/usr/bin/env node

global.workdir = process.cwd(); //工作目录
global.appdir = __dirname; //程序目录

let files = require('./lib/files');
let manage_server = require('./lib/manage_server');
if(!files.exists('./feauto.config.json')){ 
  let rndport = 8000 + Math.floor(Math.random()*999+1);
  manage_server(rndport).then(function(){
    let opn = require('opn');
    opn('http://localhost:' + rndport + '/init/');
  });
  return false;
}


let memory_file = require('./lib/memory_file')
memory_file.data = {}; //内存文件


const jsonfile = require('jsonfile');
global.config = jsonfile.readFileSync('./feauto.config.json'); //项目设置


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

//初始化项目
manage_server(global.config.manage_server_port);