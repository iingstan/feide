const fs = require('fs');
const path = require('path');
var express = require('express');
var router = express.Router();
//var sprites = require('../lib/sprites');
var files = require('../lib/files');
let page_data = require('../lib/page_data');
let jsonresult = require('../models/jsonresult');
const handlebars = require('handlebars');
let memory_file = require('../lib/memory_file')


router.get('/', function(req, res, next) {
  res.render('page/index', { title: '页面与文件', config: global.config });
});

router.get('/page', function(req, res, next) {
  res.render('page/page', { title: '页面', config: global.config });
});

router.get('/js', function(req, res, next) {
  res.render('page/js', { title: 'JS文件', config: global.config });
});

router.get('/css', function(req, res, next) {
  res.render('page/css', { title: 'CSS文件', config: global.config });
});

router.get('/libs', function(req, res, next) {
  res.render('page/libs', { title: 'Libs', config: global.config });
});

router.get('/preview_map', function(req, res, next) {
  res.render('page/preview_map', { title: '预览文件结构图', config: global.config });
});

router.get('/sprite', function(req, res, next) {
  res.render('page/sprite', { title: 'CSS Sprite', config: global.config });
});

router.get('/modules', function(req, res, next) {
  res.render('page/modules', { title: 'Modules', config: global.config });
});



router.get('/sprite_mergecss', function(req, res, next) {
  // sprites.getMergeCss(function(css){
  //   res.setHeader("Content-Type", 'text/css; charset=UTF-8');
  //   res.send(css);  
  // });
  if(memory_file.sprite_css != undefined){
    res.setHeader("Content-Type", 'text/css; charset=UTF-8');
    res.send(memory_file.sprite_css);     
  }
  else{
    next()
  }
  
});

router.get('/get_layout', function(req, res, next) {
  let layouts = files.getLayout();
  let result = layouts.map(v => v.filename);
  let resultjson = new jsonresult(true, '', result);
  res.json(resultjson);
});

router.get('/get_previewmap', function(req, res, next) {
  let result = {};
  result.config = global.config;
  result.pagehbs = files.getPageHbs();
  result.pageless = files.getPageLess();
  result.libscss = files.getLibsCss();
  result.pagejs = files.getPageJs();
  result.libsjs = files.getLibsJs();
  let resultjson = new jsonresult(true, '', result);
  res.json(resultjson);
});

/**
 * 获取页面数据
 */
router.get('/get_page_data', function(req, res, next) {
  let pagepath = req.query.pagepath;
  let resultjson = new jsonresult(true, '', page_data.get(pagepath));
  res.json(resultjson);
});

/**
 * 保存页面数据
 */
router.post('/save_page_data', function(req, res, next) {
  let pagedata = JSON.parse(req.body.pagedata);
  let pagepath = req.body.pagepath;
  
  try {
    page_data.save(pagepath, pagedata);
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  } catch (error) {
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);    
  }
});

/**
 * 修改页面布局页
 */
router.post('/mody_page_layout', function(req, res, next) {
  let layout = req.body.layout;
  let pagepath = req.body.pagepath;

  let this_page_data = page_data.get(pagepath)
  this_page_data.layout = layout
  
  try {
    page_data.save(pagepath, this_page_data);
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  } catch (error) {
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);    
  }
});


/**
 * 新建布局页
 */
router.post('/create_layout', function (req, res, next) {
  var layout_name = req.body.layout_name;
  let resultjson = new jsonresult(true, '', null)
  try {
    files.createFileByTemplate('new_layout', path.join('page', '_layout', layout_name + '.hbs'), {})    
  } catch (error) {
    resultjson.re = false
    resultjson.message = error.message
  }
  res.json(resultjson)
});


/**
 * 新建页面
 */
router.post('/create_page', function (req, res, next) {
  var page_name = req.body.page_name;
  var extra_js = req.body.extra_js == 'true' ? true : false;
  var extra_less = req.body.extra_less == 'true' ? true : false;
  var page_layout = req.body.page_layout;

  let create_page_options = {
    page_name: page_name,
    extra_js: extra_js,
    extra_less: extra_less,
    page_layout: page_layout
  }

  createNewPage(page_name, create_page_options).then(function(){
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  }).catch(function(error){
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});

/**
 * 新建模块
 */
router.post('/create_module', function (req, res, next) {
  let create_module_options = {}
  create_module_options.module_name = req.body.module_name
  create_module_options.module_description = req.body.module_description
  create_module_options.create_md = req.body.create_md == 'true' ? true : false
  create_module_options.module_template = req.body.module_template

  let femodule = require('../lib/femodule')

  if(femodule.exists(create_module_options.module_name)){
    let resultjson = new jsonresult(false, '已经有此模块', null)
    res.json(resultjson)
    return false
  }

  femodule.create(create_module_options).then(function(){
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  }).catch(function(error){
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  })
});

/**
 * 删除页面
 */
router.post('/delete_page', function (req, res, next) {
  var pagename = req.body.pagename;

  files.delete(path.join(global.workdir, 'page/' + pagename));

  let resultjson = new jsonresult(true, '', null);

  res.json(resultjson);
});



function createNewPage(page_name, options){
  return new Promise(function(resolve, reject){
    files.createFileByTemplate("new_page", path.join(global.workdir, 'page', page_name + '.hbs'), options);
    if(options.extra_js){
      files.createFileByTemplate("new_pagejs", path.join(global.workdir, 'js', page_name + '.js'), options);
    }
    if(options.extra_less){
      files.createFileByTemplate("new_pageless", path.join(global.workdir, 'css',  page_name + '.less'), options);
    }
    if(options.page_layout){
      page_data.save(path.join(global.workdir, 'page', page_name + '.hbs'), {
        layout: options.page_layout
      });
    }
    resolve();
  });
}

/**
 * 获取页面列表
 */
router.get('/pagelist', function (req, res, next) {
  let globpath = 'page/**/*.hbs';
  files.getFileInfo(globpath, {
    ignore: 'page/+(_layout|_partial)/*.hbs'
  }).then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});


/**
 * 获取libs列表
 */
router.get('/libslist', function (req, res, next) {
  let globpath = 'libs/**/*.*';
  files.getFileInfo(globpath, {
    //ignore: 'page/+(_layout|_partial)/*.hbs'
  }).then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});


/**
 * 布局页列表
 */
router.get('/layoutlist', function (req, res, next) {
  files.getFileInfo('page/_layout/**/*.hbs').then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});

/**
 * 局部页列表
 */
router.get('/partiallist', function (req, res, next) {
  files.getFileInfo('page/_partial/**/*.hbs').then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});


/**
 * 获取js列表
 */
router.get('/jslist', function (req, res, next) {
  let globpath = 'js/*.{js,jsx,ts,tsx}';
  files.getFileInfo(globpath, {
    //ignore: 'page/modules/**/*.hbs'
  }).then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});

/**
 * 获取css列表
 */
router.get('/csslist', function (req, res, next) {
  let globpath = 'css/*.{less,scss,css}';
  files.getFileInfo(globpath, {
    //ignore: 'page/modules/**/*.hbs'
  }).then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});

/**
 * 获取css列表
 */
router.get('/partial_csslist', function (req, res, next) {
  let globpath = 'css/_partial/*.{css,less}';
  files.getFileInfo(globpath, {
    //ignore: 'page/modules/**/*.hbs'
  }).then(files=>{
    let resultjson = new jsonresult(true, '', files);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});

/**
 * 新建js
 */
router.post('/create_js', function (req, res, next) {
  var js_name = req.body.js_name;

  try {
    files.writeFileSync(path.join('js', js_name + '.js'), '//' + js_name, 'utf-8');
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  } catch (error) {
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);    
  }
  return false
});

/**
 * 新建css
 */
router.post('/create_css', function (req, res, next) {
  var css_name = req.body.css_name;

  try {
    files.writeFileSync(path.join('css', css_name + '.less'), '//' + css_name, 'utf-8');
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  } catch (error) {
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);    
  }

});

/**
 * 新建partial_css
 */
router.post('/create_partial_css', function (req, res, next) {
  var partial_css_name = req.body.partial_css_name;

  try {
    files.writeFileSync(path.join('css', '_partial', partial_css_name + '.less'), '//' + partial_css_name, 'utf-8');
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  } catch (error) {
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);    
  }

});

/**
 * 新建局部页
 */
router.post('/create_partial', function (req, res, next) {
  var partial_name = req.body.partial_name;
  let resultjson = new jsonresult(true, '', null)
  try {
    files.createFileByTemplate('new_partial', path.join('page', '_partial', partial_name + '.hbs'), {name: partial_name})    
  } catch (error) {
    resultjson.re = false
    resultjson.message = error.message
  }
  res.json(resultjson)
});


/**
 * 雪碧图文件列表
 */
router.get('/sprites_list', function (req, res, next) {
  let resultjson = new jsonresult(true, '', files.getSpriteImg())
  res.json(resultjson)
});

/**
 * 获取模块列表
 */
router.get('/module_list', function (req, res, next) {
  files.getModules().then(modules=>{
    let resultjson = new jsonresult(true, '', modules);
    res.json(resultjson);
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  });
});


module.exports = router;
