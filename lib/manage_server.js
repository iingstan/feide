var express = require('express');
var hbs = require('hbs');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const glob = require('glob')
const log = require('./log')

let route_list = {}
glob.sync('./routes/*.js', {
  cwd: global.appdir
}).forEach(v => {
  let filename = path.basename(v, '.js')
  route_list[filename] = require(path.join(global.appdir, 'routes', filename))
})

var app = express();

// set the view engine to use handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(global.appdir, 'views'));
app.set('view options', {
  layout: 'share/layout'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(global.appdir, 'public')));
app.use('/spritesimg', express.static(path.join(global.workdir, 'css', '_sprite')));



hbs.registerHelper('partial', function (name, context) {
  var partialhbs = fs.readFileSync(name, 'utf-8');
  var template = hbs.handlebars.compile(partialhbs);
  var result = template({
    name: 'hello'
  });
  return new hbs.handlebars.SafeString(result);
});

var blocks = {};
hbs.registerHelper('extend', function (name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function (name, context) {
  var val = (blocks[name] || []).join('\n');
  // clear the block
  blocks[name] = [];
  return val;
});

// app.use(function(req, res, next) {
//   let useragent = req.headers['user-agent'].toLowerCase();;
//   //console.info(useragent);
//   let isie = /msie [6-9]/ig;
//   if(isie.test(useragent)){
//     res.send('浏览器版本过低！');
//   }
//   else{
//     next();    
//   }
// });

for (let v in route_list) {
  if (v == 'home') app.use('/', route_list[v])
  app.use('/' + v, route_list[v]);
}

app.use('/preview', express.static(path.join('public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  log.log('404: ' + req.url, 'red')
  var err = new Error(req.url + ' Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = function (port) {
  return new Promise(function (resolve, reject) {
    app.listen(port, function () {
      resolve();
      log.log("前端项目管理服务启动 端口号:" + port, 'green');
    });
  });
}