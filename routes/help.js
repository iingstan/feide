var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('help/index', { title: '使用帮助', config: global.config });
});

router.get('/todo', function(req, res, next) {
  res.render('help/todo', { title: 'TO DO', config: global.config });
});



module.exports = router;