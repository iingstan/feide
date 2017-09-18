var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var configfile = require('../lib/config');
var multer = require('multer')
var upload = multer();
var request = require('request');
var tools = require('../lib/tools');
var publish = require('../lib/publish');
let files = require('../lib/files');
const page_data = require('../lib/page_data')


var jsonresult = {
  re: true,
  message: '',
  result: null
}

// /* 修改配置 */
// router.get('/test', function (req, res, next) {
//   res.send(fehbs.compile('gggg'));
// });

/* 修改配置 */
router.post('/mody_config', function (req, res, next) {
  try {

    let mody_config = {}

    if(req.body.project_name != null){
      mody_config.project_name = req.body.project_name
    }
    if(req.body.manage_server_port != null){
      mody_config.manage_server_port = req.body.manage_server_port
    }
    if(req.body.css_compress_ie != null){
      mody_config.css_compress = {}
      mody_config.css_compress.css_compress_ie = req.body.css_compress_ie
    }
    if(req.body.js_babel != null){
      mody_config.js_babel = (req.body.js_babel == 'true')?true:false
      if(mody_config.js_babel != global.config.js_babel){
        const fewebpack = require('../lib/fewebpack')
        fewebpack.restart()
      }      
    }
    if(req.body.js_compress_console != null){
      mody_config.js_compress = {}
      mody_config.js_compress.console = (req.body.js_compress_console == 'true')?true:false    
    }

    var newconfig = _.extend(global.config, mody_config);

    configfile.save(newconfig);

    jsonresult.re = true;
    jsonresult.message = '';
    jsonresult.result = null;

    global.config = newconfig;

  } catch (e) {
    jsonresult.re = false;
    jsonresult.message = e.message;
    jsonresult.result = null;
  }


  res.json(jsonresult);
});





/**
 * 删除布局页
 */
router.post('/delete_layout', function (req, res, next) {
  var layout_name = req.body.layout_name;

  fs.unlinkSync(path.join(global.workdir, 'layout/' + layout_name)),

  jsonresult.re = true;
  jsonresult.message = '',
  jsonresult.result = null;

  res.json(jsonresult);
});

/**
 * 删除文件
 */
router.post('/delete_file', function (req, res, next) {
  var filepath = req.body.filepath;

  fs.unlinkSync(filepath)
  if(path.extname(filepath) == '.hbs'){
    page_data.del(filepath)
  }

  jsonresult.re = true;
  jsonresult.message = '',
  jsonresult.result = null;

  res.json(jsonresult);
});




/**
 * 删除局部页
 */
router.post('/delete_partial', function (req, res, next) {
  var partial_name = req.body.partial_name;

  fs.unlinkSync(path.join(global.workdir, 'partials/' + partial_name)),

  jsonresult.re = true;
  jsonresult.message = '',
  jsonresult.result = null;

  res.json(jsonresult);
});

/**
 * 获取通用文件列表
 */
router.get('/common_list', function (req, res, next) {
  var pagelist = files.readDirectory(path.join(global.workdir, 'common'));

  var result = [];
  if(pagelist != null){
    pagelist.forEach(function (v) {
      var stat = fs.lstatSync(path.join(global.workdir, 'common/' + v));
      if(stat.isFile()){
        result.push({
          filename: v,
          size: stat.size,
          mtime: stat.mtime,
          ctime: stat.birthtime
        });
      }
    });    
  }


  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = result;

  res.json(jsonresult);
});

/**
 * 获取公共库文件列表
 */
router.get('/libs_list', function (req, res, next) {
  var pagelist = files.readDirectory(path.join(global.workdir, 'libs'));

  var result = [];
  if(pagelist != null){
    pagelist.forEach(function (v) {
      var stat = fs.lstatSync(path.join(global.workdir, 'libs/' + v));
      if(stat.isFile()){
        //console.info(stat);
        result.push({
          filename: v,
          size: stat.size,
          mtime: stat.mtime,
          ctime: stat.birthtime
        });
      }
    });    
  }

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = result;

  res.json(jsonresult);
});



/**
 * 新建发布配置
 */
router.post('/create_publish', function (req, res, next) {
  var publish_name = req.body.publish_name;
  var publish_folder = req.body.publish_folder;
  var publish_page = req.body.publish_page === "true" ? true : false;
  // var publish_datefolder = req.body.publish_datefolder === "true" ? true : false;
  //var publish_delete_file = req.body.publish_delete_file === "true" ? true : false;
  var publish_compress = req.body.publish_compress === "true" ? true : false;  

  if(global.config.publish == undefined){
    global.config.publish = [];
  }

  global.config.publish.push({
    publish_name: publish_name,
    publish_folder: publish_folder,
    publish_page: publish_page,
    // publish_datefolder: publish_datefolder,
    //publish_delete_file: publish_delete_file,
    publish_compress: publish_compress
  });

  configfile.save(global.config);

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;

  res.json(jsonresult);
});

/**
 * 修改发布配置
 */
router.post('/edit_publish', function (req, res, next) {
  var index = parseInt(req.body.index);
  var publish_name = req.body.publish_name;
  var publish_folder = req.body.publish_folder;
  var publish_page = req.body.publish_page === "true" ? true : false;
  // var publish_datefolder = req.body.publish_datefolder === "true" ? true : false;
  //var publish_delete_file = req.body.publish_delete_file === "true" ? true : false;
  var publish_compress = req.body.publish_compress === "true" ? true : false;  

  global.config.publish.splice(index, 1, {
    publish_name: publish_name,
    publish_folder: publish_folder,
    publish_page: publish_page,
    // publish_datefolder: publish_datefolder,
    //publish_delete_file: publish_delete_file,
    publish_compress: publish_compress
  });

  configfile.save(global.config);

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;

  res.json(jsonresult);
});

/**
 * 删除发布配置
 */
router.post('/delete_publish', function (req, res, next) {
  var index = parseInt(req.body.index);


  global.config.publish.splice(index, 1);

  configfile.save(global.config);

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;

  res.json(jsonresult);
});



/**
 * 获取配置文件
 */
router.get('/get_config', function (req, res, next) {
  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = global.config;

  res.json(jsonresult);
});

/**
 * 获取用户配置文件
 */
router.get('/get_user_config', function (req, res, next) {
  let appdata = require('../lib/appdata')
  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = appdata.get();

  res.json(jsonresult);
});

/**
 * 新建公共库 上传文件
 */
router.post('/create_libs_byfile', upload.single('create_libs_uploadfile'), function (req, res, next) {

  //console.info(req.file);
  files.writeFileSync(path.join(global.workdir, 'libs/' + req.file.originalname), req.file.buffer);
  jsonresult.re = true;
  jsonresult.message = '',
  jsonresult.result = null;
  res.json(jsonresult);
  // fs.writeFile(, function (error) {

  //   if (error) {
  //     jsonresult.re = false;
  //     jsonresult.message = error.message;
  //   }

    
  // });
});

/**
 * 新建公共库 url下载
 */
router.post('/create_libs_byurl', function (req, res, next) {
  var create_libs_uploadurl = req.body.create_libs_uploadurl;

  request(create_libs_uploadurl, function (error, response, body) {
    jsonresult.result = null;
    if (error != null) {
      jsonresult.re = false;
      jsonresult.message = error.message;
      res.json(jsonresult);
    }
    else{
      files.writeFileSync(path.join(global.workdir, 'libs/' + tools.getFilenameFromUrl(create_libs_uploadurl)), body);
      jsonresult.re = true;
      jsonresult.message = '';
      res.json(jsonresult);
      //   fs.writeFile(path.join(global.workdir, 'libs/' + tools.getFilenameFromUrl(create_libs_uploadurl)), body, function (error) {
      //     jsonresult.re = true;
      //     jsonresult.message = '';
      //     if (error) {
      //       jsonresult.re = false;
      //       jsonresult.message = error.message;
      //     }

          
      // });
    }

  });
});

/**
 * 删除公共库
 */
router.post('/delete_libs', function (req, res, next) {
  var libsname = req.body.libsname;

  fs.unlinkSync(path.join(global.workdir, 'libs/' + libsname)),

  jsonresult.re = true;
  jsonresult.message = '',
  jsonresult.result = null;

  res.json(jsonresult);
});




/**
 * 获取组件列表
 */
router.get('/components_list', function (req, res, next) {
  var pagelist = files.readDirectory(path.join(global.workdir, 'components'));

  var result = [];
  if(pagelist != null){
    pagelist.forEach(function (v) {
      var stat = fs.lstatSync(path.join(global.workdir, 'components/' + v));
      if(stat.isDirectory()){
        //console.info(stat);
        result.push({
          filename: v
        });
      }
    });    
  }



  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = result;

  res.json(jsonresult);
});

module.exports = router;