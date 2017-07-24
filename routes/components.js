var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('components/index', { title: '组件', config: global.config });
});


module.exports = router;