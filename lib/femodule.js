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
    let promise_list = [
      this.createFile(create_module_options),
      this.createJson(create_module_options)
    ]
    if (create_module_options.create_md) {
      promise_list.push(this.createMDFile(create_module_options))
    }
    return Promise.all(promise_list)
  },
  /**
   * 创建模块js文件
   * 
   * @param {any} create_module_options 
   * @returns 
   */
  createFile(create_module_options){
    return new Promise((resolve, reject)=>{
      let module_template_name = 'new_module_default';
      switch (create_module_options.module_template) {
        case 'function':
          module_template_name = 'new_module_function'
          break;
        case 'object':
          module_template_name = 'new_module_object'
          break;
        case 'lclass':
          module_template_name = 'new_module_lclass'
          break;          
        default:
          module_template_name = 'new_module_default'
          break;
      }
      try {
        files.createFileByTemplate(module_template_name, path.join(global.workdir, 'js', 'modules',create_module_options.module_name, 'index.js'), create_module_options)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * 创建模块package.json
   * 
   * @param {any} module_info 
   * @returns 
   */
  createJson(module_info){
    return new Promise((resolve, reject)=>{
      try {
        if(module_info.module_main == '' || module_info.module_main == undefined){
          module_info.module_main = 'index.js'
        }
        if(module_info.module_version == '' || module_info.module_version == undefined){
          module_info.module_version = '1.0.0'
        }
        if(module_info.module_keywords == '' || module_info.module_keywords == undefined){
          module_info.module_keywords = []
        }
        else{
          module_info.module_keywords = module_info.module_keywords.split(',')
        }
        module_info.module_keywords = JSON.stringify(module_info.module_keywords)

        files.createFileByTemplate('new_module_package', path.join(global.workdir, 'js','modules',module_info.module_name, 'package.json'), module_info)
        resolve()
      } catch (error) {
        reject(error)
      }
    })    
  },
  /**
   * 创建模块README.md文件
   * 
   * @param {any} create_module_options 
   * @returns 
   */
  createMDFile(create_module_options){
    return new Promise((resolve, reject)=>{
      try {
        files.createFileByTemplate('new_module_md', path.join(global.workdir, 'js', 'modules',create_module_options.module_name, 'README.md'), create_module_options)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * 修改模块
   * 
   * @param {any} module_info 
   * @returns 
   */
  update(module_info){
    return this.createJson(module_info)
  },
  /**
   * 获取某个模块的信息
   * 
   * @param {any} module_name 模块名称
   * @returns 
   */
  getModulePackageJson(module_name){
    let jsonfile_path = path.join(global.workdir, 'js', 'modules', module_name, 'package.json')
    if(files.exists(jsonfile_path)){
      return jsonfile.readFileSync(jsonfile_path)
    }
    else{
      return null
    }
  },
  /**
   * 判断模块是否已存在
   * 
   * @param {any} module_name 模块名称
   * @returns 
   */
  exists(module_name){
    return files.exists(path.join(global.workdir, 'js', 'modules', module_name))
  }
}

module.exports = femodule