var express = require('express');
var router = express.Router();
const fs = require('fs');
const tools = require('../lib/tools');
const path = require('path');

router.get('/', function (req, res, next) {
  let filepath = req.query.path;
  let extname = path.extname(filepath);
  let highlight_extname = '';
  switch (extname) {
    case '.hbs':
      highlight_extname = 'Handlebars'
      break;
    case '.js':
      highlight_extname = 'JavaScript'
      break;
    case '.less':
      highlight_extname = 'Less'
      break;   
    case '.scss':
      highlight_extname = 'SCSS'
      break;            
    case '.css':
      highlight_extname = 'CSS'
      break;
    case '.html':
      highlight_extname = 'HTML'
      break;
    case '.json':
      highlight_extname = 'JSON'
      break;
    case '.md':
      highlight_extname = 'Markdown'
      break;      
    default:
      break;
  }
  let filesource = fs.readFileSync(filepath, "utf-8");
  res.render('codeview/index', {
    title: '查看代码',
    config: global.config,
    filepath: filepath,
    filesource: filesource,
    highlight_extname: highlight_extname
  });
});

router.get('/raw', function (req, res, next) {
  let filepath = req.query.path;
  tools.readBigFile(filepath, function (content) {
    res.setHeader("Content-Type", 'text/plain; charset=utf-8');
    res.send(content);
  });
});

module.exports = router;