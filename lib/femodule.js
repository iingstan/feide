/**
 * 项目模块管理
 */
const files = require('./files')
const path = require('path')
const jsonfile = require('jsonfile')

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
      try {
        files.createFileByTemplate('new_module_default', path.join(global.workdir, 'js', 'modules',create_module_options.module_name, 'index.js'), create_module_options)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  createJson(create_module_options){
    return new Promise((resolve, reject)=>{
      try {
        files.createFileByTemplate('new_module_package', path.join(global.workdir, 'js','modules',create_module_options.module_name, 'package.json'), create_module_options)
        resolve()
      } catch (error) {
        reject(error)
      }
    })    
  },
  getModulePackageJson(module_name){
    let jsonfile_path = path.join(global.workdir, 'js', 'modules', module_name, 'package.json')
    if(files.exists(jsonfile_path)){
      return jsonfile.readFileSync(jsonfile_path)
    }
    else{
      return null
    }
  },
  exists(module_name){
    return files.exists(path.join(global.workdir, 'js', 'modules', module_name))
  }
}

module.exports = femodule