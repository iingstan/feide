/**
 * 项目模块管理
 */
let files = require('./files')

let femodule = {
  /**
   * 创建模块
   */
  create(create_module_options){
    return Promise.all([
      this.createFile(create_module_options),
      this.createJson(create_module_options)
    ])
  },
  createFile(create_module_options){
    return new Promise((resolve, reject)=>{
      File
    })
  },
  createJson(create_module_options){
    
  }
}

module.exports = femodule