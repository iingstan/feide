var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('config/index', { title: '项目配置', config: global.config });
});

router.get('/webpack', function(req, res, next) {
  res.render('config/webpack', { title: 'JS编译设置', config: global.config });
});



module.exports = router;
