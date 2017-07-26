var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('config/index', { title: '项目配置', config: global.config });
});

router.get('/js_compile', function(req, res, next) {
  res.render('config/js_compile', { title: 'JS编译设置', config: global.config });
});

router.get('/js_compress', function(req, res, next) {
  res.render('config/js_compress', { title: 'JS压缩设置', config: global.config });
});

router.get('/style_compile', function(req, res, next) {
  res.render('config/style_compile', { title: '样式编译设置', config: global.config });
});

router.get('/style_compress', function(req, res, next) {
  res.render('config/style_compress', { title: 'css压缩设置', config: global.config });
});

module.exports = router;
