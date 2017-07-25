var express = require('express');
var router = express.Router();
var files = require('../lib/files');
let jsonresult = require('../models/jsonresult');
const path = require('path');
const jsonfile = require('jsonfile');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('init/index', { title: '初始化项目', layout:'', workdir:global.workdir });
});

router.post('/init_project', function(req, res, next) {
  let project_name = req.body.project_name
  let server_port = req.body.server_port
  let new_file = parseInt(req.body.new_file)
  let resultjson = new jsonresult(true, '', null);

  files.createFileByTemplate('new_config', path.join(global.workdir, 'feauto.config.json'), {
    project_name: project_name,
    server_port: server_port
  });

  if(new_file > 0){
    ["css","js","libs","page", "public","css/_partial","css/_sprite","js/modules","page/_layout", "page/_partial"].forEach(v=>{
      files.createDirectory(path.join(global.workdir, v, path.delimiter))
    })
  }

  global.config = jsonfile.readFileSync('./feauto.config.json');
    
  res.json(resultjson);
});


module.exports = router;
