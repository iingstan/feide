var express = require('express');
var hbs = require('hbs');
var fs = require('fs');
var recursive = require('recursive-readdir');
var less = require('less');
var path = require('path');

var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");

var webpackConfig = {
  entry: {
    common: './common/common.js',
    index: './page/index/index.js',
    about: './page/about/about.js',
    index2: './page/index2/index2.js'
  },
  output: {
    path: path.join(global.workdir, 'bundle/js'),
    publicPath: '/js',
    filename: '[name].js'
  }
};
var compiler = webpack(webpackConfig);

// recursive('page',  ['*.!(css)'], function (err, files) {
//   // Files is an array of filename
//   console.log(files);
// });

var app = express();

app.set('view engine', 'hbs');
app.set('views', global.workdir + '/page');

app.use(webpackDevMiddleware(compiler, {
  publicPath: "/js", // 大部分情况下和 `output.publicPath`相同
  noInfo: true,
  quiet: true
}));


//console.info( __dirname + '/views');
//console.info(global.workdir + '/page');

var blocks = {};

hbs.registerHelper('partial', function (name, context) {
  var partialhbs = fs.readFileSync(name, 'utf-8');
  var template = hbs.handlebars.compile(partialhbs);
  var result = template({ name: 'hello' });
  return new hbs.handlebars.SafeString(result);
});

hbs.registerHelper('extend', function (name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function (name) {
  var val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});

app.get('/', function (req, res) {
  res.send('hello');
});

app.get('/test', function (req, res) {
  res.render('index/index');
});

app.get('/:pagename([a-zA-z0-9_]+)', function (req, res) {
  let pagename = req.params.pagename;
  res.render(pagename + '/' + pagename, { layout: '../layout/layout' });
});

// app.get('/js/common.js', function (req, res) {
//     var filestr = [];
//     recursive('libs', ['*.!(css)'], function (err, files) {
//         files.sort();
//         files.forEach(function (v, i) {
//             let filec = fs.readFileSync(v, 'utf-8');
//             filestr.push('/*' + v + '*/')
//             filestr.push(filec);
//         });
//         res.setHeader("Content-Type", 'text/css; charset=utf-8');
//         res.send(filestr.join('\n'));
//     });
// });

app.get('/js/libs.js', function (req, res) {
  var filestr = [];
  recursive('libs', ['*.!(js)'], function (err, files) {
    files.sort();
    files.forEach(function (v, i) {
      let filec = fs.readFileSync(v, 'utf-8');
      filestr.push('/*' + v + '*/')
      filestr.push(filec);
    });
    res.setHeader("Content-Type", 'application/x-javascript; charset=utf-8');
    res.send(filestr.join('\n'));
  });
});

app.get('/js/:pagejs([a-zA-z0-9_]+\.js)', function (req, res) {
  let pagejs = req.params.pagejs;
  let jsfile = fs.readFileSync('./page/' + pagejs.replace('.js', '') + '/' + pagejs, 'utf-8');

  res.setHeader("Content-Type", 'application/x-javascript; charset=utf-8');
  res.send(jsfile);
});


/**
 * page css img
 */
app.get('/css/:pagename([a-zA-z0-9_]+)/img/:filename', function (req, res) {
  let pagename = req.params.pagename;
  let filename = req.params.filename;

  console.info(pagename);
  console.info(filename);

  let readfile = fs.readFileSync(path.join(
    global.workdir,
    'page',
    'img',
    filename
  ));

  let ext = path.extname(filename).substring(1);

  res.setHeader("Content-Type", 'image/' + ext);
  res.send(readfile);

});

app.get('/css/common.css', function (req, res) {
  var filestr = [];
  recursive('libs', ['*.!(css)'], function (err, files) {
    files.sort();
    files.forEach(function (v, i) {
      let filec = fs.readFileSync(v, 'utf-8');
      filestr.push('/*' + v + '*/')
      filestr.push(filec);
    });
    res.setHeader("Content-Type", 'text/css; charset=utf-8');
    res.send(filestr.join('\n'));
  });
});


app.get('/css/:pagecss([a-zA-z0-9_-]+\.css)', function (req, res) {
  let pagecss = req.params.pagecss;
  let cssfile = fs.readFileSync('./page/' + pagecss.replace('.css', '') + '/' + pagecss.replace('.css', '') + '.less', 'utf-8');
  //console.info();
  less.render(cssfile, {
    filename: path.resolve('./page/' + pagecss.replace('.css', '') + '/' + pagecss.replace('.css', '') + '.less'), // <- here we go
  }, function (e, output) {
    if (e != null) {
      console.info(e.message);
    }
    //console.log();
    res.setHeader("Content-Type", 'text/css; charset=utf-8');
    res.send(output.css);
  });
});





module.exports = function (port) {
  app.listen(port, function () {
    console.info('前端项目开发预览服务启动 请用浏览器打开 http://localhost:' + port + '/index');
  });
}