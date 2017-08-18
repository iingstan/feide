/**
 * 项目模块管理
 */
const files = require('./files')
const path = require('path')
const jsonfile = require('jsonfile')
const config = require('./config')
const request = require('request')
const glob = require('glob')
const fs = require('fs')
const weblib = require('./weblib')

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
   * 修改模块服务器设置
   * 
   */
  setupServer(module_info){
    return new Promise((resolve, reject)=>{
      try {
        global.config.module_server_url = module_info.module_server_url
        global.config.module_author = module_info.module_author
        config.save(global.config)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * 发布模块
   * 
   */
  uploadModule(module_path){
    return new Promise((resolve, reject)=>{
      if(global.config.module_server_url == undefined || global.config.module_server_url == ''){
        reject(new Error('没有配置模块服务器地址'))
        return
      }
      if(global.config.module_author == undefined || global.config.module_author == ''){
        reject(new Error('没有配置模块服务器授权字符串'))
        return
      }

      let module_name = path.basename(module_path)
      let module_json = this.getModulePackageJson(module_name)

      if(module_json == null){
        reject(new Error('没有配置模块的基本信息(package.json)'))
        return
      }
      if(module_json.version == undefined || module_json.version == ''){
        reject(new Error('没有配置模块的基本信息(package.json)里面的版本号(version)'))
        return
      }   
      if(module_json.description == undefined ){
        module_json.description == ''
      }           

      this.uploadModuleByPath(module_path, module_json).then((back)=>{
        resolve(back)
      }).catch(error=>{
        reject(error)
      })
    })
  },
  /**
   * 上传模块
   * @param {*} module_path 
   */
  uploadModuleByPath(module_path, module_json){
    //console.info(glob.sync(module_path, {}));
    return new Promise((resolve, reject)=>{
      var formData = {
        module_name: path.basename(module_path),
        module_author: global.config.module_author,
        module_version: module_json.version,
        module_intro: module_json.description,
        module_files_path: glob.sync('**/*.*', {
          cwd: module_path
        }),
        attachments: glob.sync(module_path + '/**/*.*', {}).map(v=>{
          return fs.createReadStream(v)
        }) 
      }
      request.post({url: global.config.module_server_url + '/modules/uptest', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          reject(err)
        }
        else{
          resolve(body)
        }
      })      
    })

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
  },
  /**
   * 下载模块
   * 
   * @param {any} module_name 模块名字
   * @param {any} module_version 模块版本
   */
  downloadModule(module_name, module_version){
    let module_server_url = global.config.module_server_url
    return new Promise((resolve, reject)=>{
      if(this.checkDownloadModule(module_name)){
        reject(new Error('已存在此模块'))
        return
      }

      this.getModuleInfo(module_name, module_version).then(module_info=>{
        module_info = JSON.parse(module_info)

        console.info(module_info.files);

        return Promise.all(
          module_info.files.map(v=>{
            return weblib.getAndSaveWebFile(
              `${module_server_url}/file/${module_name}/${module_version}/${v}`,
              path.join(global.workdir, 'js', 'modules', module_name, v)
            )
          })
        )
      }).then(()=>{
        resolve()
      }).catch(err=>{
        reject(err)
      })      
    })
  },
  /**
   * 是否已存在模块
   * 
   * @param {any} module_name 模块名称
   * @returns 
   */
  checkDownloadModule(module_name){
    return files.exists(path.join(
      global.workdir,
      'js',
      'modules',
      module_name
    ))
  },
  /**
   * 获取模块信息
   * 
   * @param {any} module_name 模块名字
   * @param {any} module_version 模块版本
   */
  getModuleInfo(module_name, module_version){
    let module_server_url = global.config.module_server_url
    return weblib.getWebFile(`${module_server_url}/api/module/${module_name}?version=${module_version}`)
  }
}

module.exports = femodule