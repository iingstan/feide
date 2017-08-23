/**
 * 模块服务器
 */
let appdata = require('./appdata')

module.exports = {
  /**
   * 初始化服务器地址
   * 
   */
  pathInit(){
    let server_path = 'http://172.16.58.153:8870'
    let config = appdata.get()
    if(config.module_server_url == undefined){
      config.module_server_url = server_path
      appdata.save(config)      
    }

  },

  /**
   * 修改模块服务器配置
   * 
   * @param {any} module_server_url 
   * @param {any} module_author 
   */
  save(module_server_url, module_author){
    let config = appdata.get()
    config.module_server_url = module_server_url
    config.module_author = module_author
    appdata.save(config)
  }
}