var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var tools = require('../lib/tools');

router.get('/view/:filetype/:filename', function(req, res, next) {

  tools.readBigFile(path.join(global.workdir,  req.params.filetype + '/' + req.params.filename), function(content){
    res.setHeader("Content-Type", 'text/plain; charset=utf-8');
    res.send(content);
  });
});


module.exports = router;