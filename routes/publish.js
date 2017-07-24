var express = require('express');
var router = express.Router();
var publish = require('../lib/publish');
let jsonresult = require('../models/jsonresult');
let log = require('../lib/log')

router.get('/', function(req, res, next) {
  res.render('publish/index', { title: '发布', config: global.config });
});

/**
 * 发布
 */
router.post('/publish', function (req, res, next) {
  var index = parseInt(req.body.index);

  var config = global.config.publish[index];

  publish.publish(config)
  .then(function(){
    let resultjson = new jsonresult(true, '', null);
    res.json(resultjson);
  })
  .catch(function(error){
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);     
  });

});


module.exports = router;