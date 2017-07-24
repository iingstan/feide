var express = require('express');
var router = express.Router();
var proxy = require('../lib/proxy');
var configfile = require('../lib/config');

let newproxy = null;

let jsonresult = {
  re: true,
  message: '',
  result: null
}


router.get('/', function (req, res) {
    res.render('proxy/index', { title: '代理服务', config: global.config });
});

router.post('/open', function (req, res) {
  let rules = JSON.parse(req.body.rules);
  let portnum = parseInt(req.body.portnum);
  if (newproxy == null) {
    newproxy = new proxy({
      rules: rules,
      portnum: portnum
    });
  }
  newproxy.open();
  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;
  res.json(jsonresult);
});

router.post('/save', function (req, res) {
  let rules = JSON.parse(req.body.rules);
  let portnum = parseInt(req.body.portnum);

  global.config.proxy = {
    proxy_port: portnum,
    proxy_rules: rules
  };

  configfile.save(global.config);

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;
  res.json(jsonresult);
});

router.get('/getrules', function (req, res) {
  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = global.config.proxy;
  res.json(jsonresult);
});

router.get('/close', function (req, res) {
  if (newproxy != null) {
    newproxy.close();
    newproxy = null;
  }
  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = null;
  res.json(jsonresult);
});

router.get('/state', function (req, res) {
  var state = false
  if (newproxy != null) {
    state = true  
  }

  jsonresult.re = true;
  jsonresult.message = '';
  jsonresult.result = state;
  
  res.json(jsonresult);
});

module.exports = router;
