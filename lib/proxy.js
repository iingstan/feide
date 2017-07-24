/**
 * 代理服务
 */
const _ = require('lodash');
let express = require('express');
let proxy_middleware = require('http-proxy-middleware');
const url = require('url');
const log = require('./log')
var enableDestroy = require('./server-destroy');

function isIgnorePath(routeurl) {
  if (routeurl.substring(routeurl.length - 1) != '/') {
    return true
  }
  return false
}

class proxy {
  constructor(options) {
    let default_options = {
      portnum: 3456
    }
    this.options = _.extend(default_options, options);
    let app = this.app = express();

    this.options.rules.forEach(function (v) {
      app.use(v.route, proxy_middleware({ target: v.url, changeOrigin: true, ignorePath: isIgnorePath(v.url)})) //url.parse(v.url)
    });
  }

  /**
   * 开启代理
   * 
   * @memberof proxy
   */
  open() {
    this.server = this.app.listen(this.options.portnum, () => {
      log.log('开启代理 端口号：' + this.options.portnum, 'magenta');
    });
    enableDestroy(this.server);
  }

  /**
   * 关闭代理
   * 
   * @memberof proxy
   */
  close() {
    //try {
    // setTimeout(()=> {
    //   this.server.close();
    //   this.server = null;        
    // }, 500);

    this.server.destroy(() => {
      log.log('关闭代理', 'magenta')
      this.server = null
    });


    //} catch (error) {
    //log.log(error.message, 'red')
    //}
  }

  getState() {
    console.info(this.server);
  }
}

module.exports = proxy;