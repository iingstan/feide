var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', { title: '首页', config: global.config });
});

router.get('/index2', function(req, res, next) {
  res.render('home/index2', { layout: null });
});

module.exports = router;
