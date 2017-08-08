/**
 * 文件
 */
const fs = require("fs");
const path = require("path");
const handlebars = require('handlebars');
const mkdir = require('mkdirp');
const exists = require('fs-exists-sync');
const del = require('delete');
const glob = require("glob");

let files = {
  blankCreateFile(filepath, str, options){
    if(!exists(filepath)){
      this.writeFileSync(filepath, str, options);
    }
    else{
      return false;
    }
  },

  writeFileSync(dest, str, options){
    this.createDirectory(dest);
    fs.writeFileSync(dest, str, options);
  },

  exists(filepath){
    return exists(filepath);
  },

  createDirectory(dest) {
    //console.info(dest);
    var dir = path.dirname(dest);
    //console.info(dir);
    if (exists(dir)) return;
    mkdir.sync(dir);
  },

  delete(dest){
    del.sync(dest);
  },

  readDirectory(desc){
    if (!exists(desc)) return null;
    return fs.readdirSync(desc);
  },

  copyFile(source, target){
    return new Promise((resolve, reject)=>{
      let readStream = fs.createReadStream(source);
      this.createDirectory(target)

      readStream.once('error', (err) => {
        reject(err)
      });

      readStream.once('end', () => {
        resolve()
      });

      readStream.pipe(fs.createWriteStream(target));
    })
  },
  /**
   * glob相对路径转换成node相对路径
   */
  globPathToNodePath: function(pathstr){
    if(pathstr.indexOf('./') != 0 && pathstr.indexOf(':') < 0){
      pathstr = './' + pathstr
    }
    return pathstr
  },

  /**
   * 使用预设模板创建文件
   * 
   * @param {any} filename 模板文件名
   * @param {any} path 
   * @param {any} options 
   */
  createFileByTemplate(filename, filepath, options){
    let template = fs.readFileSync(path.join( global.appdir, 'configs', 'template', filename +'.hbs'), "utf-8");
    let file_content = handlebars.compile(template)(options);
    files.writeFileSync(filepath, file_content);
  },

  /**
   * 获取页面
   */
  getPageHbs(){
    return this.getFileBaseInfoSync('page/**/*.hbs', {
      ignore: 'page/+(_layout|_partial)/*.hbs'
    })
  },

  /**
   * 获取页面js
   */
  getPageJs(){
    return this.getFileBaseInfoSync('js/*.{js,jsx,ts,tsx}', {})
  },

 

  /**
   * 获取 layout
   */
  getLayout(){
    return this.getFileBaseInfoSync('page/_layout/*.hbs', {})
  },

  /**
   * 获取libs js
   */
  getLibsJs(){
    return this.getFileBaseInfoSync('libs/**/*.js', {})
  },

  /**
   * 获取libs css
   */
  getLibsCss(){
    return this.getFileBaseInfoSync('libs/**/*.css', {})
  },  
  /**
   * 获取sprite图片列表
   */
  getSpriteImg(){
    return this.getFileBaseInfoSync('css/_sprite/*.{jpg,png,gif}', {})
  },

  /**
   * 获取模块列表
   */
  getModules(){
    return this.getFileBaseInfo('js/modules/*/', {})
  },

  /**
   * 获取libs js content
   */
  getLibsJsContent(){
    let pagelist = this.getLibsJs()
    let result = [];

    pagelist.sort();

    pagelist.forEach(function (v) {
        result.push(fs.readFileSync(v.path, 'utf-8'));
    });      

    return result.join('\n');
  },  

  /**
   * 获取libs css content
   */
  getLibsCssContent(){
    let pagelist = this.getLibsCss()
    let result = [];

    pagelist.sort()

    pagelist.forEach(function (v) {
      result.push(fs.readFileSync(v.path, 'utf-8'));
    });      
    
    return result.join('\n');
  },    
  

  /**
   * 获取页面less
   */
  getPageLess(){
    return this.getFileBaseInfoSync('css/*.{less,css,scss}', {})
  },
  
  /**
   * 获取文件基本信息（文件夹下所有文件）
   * 
   * @param {any} globpath glob路径
   * @param {any} options glob options
   * @returns 
   */
  getFileBaseInfo(globpath, options){
    return new Promise((resolve, reject)=>{
      glob(globpath, options, function (error, files) {
        if(error){
          reject(error);
        }
        resolve(files.map(v=>{
          return {
            name: path.basename(v, path.extname(v)),
            filename: path.basename(v),
            path: v
          }
        }));
      });      
    });
  },

  getFileBaseInfoSync(globpath, options){
    return glob.sync(globpath, options).map(v=>{
      return {
        name: path.basename(v, path.extname(v)),
        filename: path.basename(v),
        path: this.globPathToNodePath(v)
      }
    })  
  },  

  /**
   * 获取文件详细信息（文件夹下所有文件），带大小和时间
   * 
   * @param {any} globpath glob路径
   * @param {any} options glob options
   * @returns 
   */
  getFileInfo(globpath, options){
    return new Promise((resolve, reject)=>{
      this.getFileBaseInfo(globpath, options).then(files=>{
        resolve(files.map(v=>{
          let stat = fs.lstatSync(v.path);
          //console.info(stat);
          return {
            name: v.name,
            filename: v.filename,
            path: v.path,
            size: stat.size,
            mtime: stat.mtime,
            ctime: stat.atime
          }
        }));
      }).catch(error=>{
        reject(error);
      });      
    });
  }

}

module.exports = files;