var express = require('express');
var router = express.Router();
let checknew = require('../lib/checknew')
let jsonresult = require('../models/jsonresult')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', { title: '首页', config: global.config });
});

router.get('/index2', function(req, res, next) {
  res.render('home/index2', { layout: null });
});

router.get('/home/newver', function(req, res, next) {
  
  checknew.hasNew().then(isnew=>{
    let resultjson = new jsonresult(true, '', isnew)
    res.json(resultjson)
  }).catch(error=>{
    let resultjson = new jsonresult(false, error.message, null)
    res.json(resultjson)
  })
});

module.exports = router;
