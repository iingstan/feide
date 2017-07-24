var express = require('express');
var router = express.Router();
//var sprites = require('../lib/sprites');
var fehbs = require('../lib/fehbs');
var fewebpack = require('../lib/fewebpack');
var feless = require('../lib/feless');
let files = require('../lib/files');
const path = require('path');
const file_make = require('../lib/file_watch/file_make')
const fs = require('fs')
let memory_file = require('../lib/memory_file')



/**
 * 页面
 */
router.get('/:pagename([a-zA-z0-9_]+)', function (req, res, next) {
  let pagename = req.params.pagename;
  let filepath = './page/' + pagename + '.hbs';
  if (files.exists(filepath)) {
    res.send(fehbs.compile(filepath));
  } else {
    next();
  }
});

router.get('/:pagename([a-zA-z0-9_]+).html', function (req, res, next) {
  let pagename = req.params.pagename;
  let filepath = './page/' + pagename + '.hbs';
  if (files.exists(filepath)) {
    res.send(fehbs.compile(filepath));
  } else {
    next();
  }
});


/**
 * libs js
 */
router.get('/js/libs.js', function (req, res) {
  res.setHeader("Content-Type", 'application/x-javascript')
  res.send(files.getLibsJsContent());
});

/**
 * page js
 */
router.get('/js/:jsname([a-zA-z0-9_]+).js', function (req, res, next) {
  let jsname = req.params.jsname;
  let filepath = './js/' + jsname + '.js';

  let filecontent = fewebpack.readJS(jsname)
  if (filecontent != null) {
    res.setHeader("Content-Type", 'application/x-javascript')
    res.send(filecontent)
  } else {
    next();
  }
});

/**
 * libs css
 */
router.get('/css/libs.css', function (req, res) {
  res.send(files.getLibsCssContent());
});

/**
 * page less
 */
router.get('/css/:cssname([a-zA-z0-9_]+).css', function (req, res, next) {
  let cssname = req.params.cssname;

  let filepath = './css/' + cssname + '.less';
  if (files.exists(filepath)) {
    file_make.compileStyle(filepath).then(function (css) {
      res.setHeader("Content-Type", 'text/css; charset=utf-8');
      res.send(css);
    }).catch(function (e) {
      next(e)
    });
  }
  else{
    filepath = './css/' + cssname + '.scss';
    if (files.exists(filepath)) {
      file_make.compileStyle(filepath).then(function (css) {
        res.setHeader("Content-Type", 'text/css; charset=utf-8');
        res.send(css);
      }).catch(function (e) {
        next(e)
      });
    }
    else{
      filepath = './css/' + cssname + '.css';
      if (files.exists(filepath)) {
        file_make.compileStyle(filepath).then(function (css) {
          res.setHeader("Content-Type", 'text/css; charset=utf-8');
          res.send(css);
        }).catch(function (e) {
          next(e)
        });
      }
      else{
        next();
      }      
    }
  }
});

router.get('/css/img/sprites.png', function(req, res, next) {
  if(memory_file.sprite_img != undefined){
    res.setHeader("Content-Type", 'image/png');
    res.send(memory_file.sprite_img);     
  }
  else{
    next()
  }
});

/**
 * css bg img
 */
router.get('/css/img/:imgname', function (req, res, next) {
  let imgname = req.params.imgname;
  let ext = path.extname(imgname).substring(1);
  res.setHeader("Content-Type", 'image/' + ext);
  try {
    res.send(fewebpack.readCssBgimg(imgname));
  } catch (error) {
    next()
  }
  
});




module.exports = router;