/**
 * 检查新版本
 */

 const path = require('path')

let checknew = {
  newver: null,
  /**
   * 获取新版本
   */
  get(){
    let _this = this
    return new Promise((resolve, reject)=>{
      if(_this.newver == null){
        let request = require('request')
        request('https://registry.npm.taobao.org/feide', function (error, response, body) {
          if(error){
            reject(error)
          }
          else{
            let npmjson = JSON.parse(body)
            let newver = npmjson['dist-tags'].latest
            _this.newver = newver
            resolve(newver)
          }
        })
      }
      else{
        return resolve(_this.newver)
      }
    })
  },
  /**
   * 检查是否有新版本
   */
  hasNew(){
    let _this = this
    let jsonfile = require('jsonfile');
    let nowver = jsonfile.readFileSync(path.join(global.appdir, 'package.json')).version
    return new Promise((resolve, reject)=>{
      _this.get().then(newver=>{
        resolve({isnew: _this.compareNew(newver, nowver), newver: newver})
      }).catch(error=>{
        reject(error)
      })      
    })
  },
  /**
   * b比较版本号
   * 
   * @param {any} newver 新版本号
   * @param {any} nowver 现在的版本号
   * @returns 
   */
  compareNew(newver, nowver){
    let newver_array = newver.split('.')
    let nowver_array = nowver.split('.')
    if(newver_array[0] > nowver_array[0]) return true
    if(newver_array[1] > nowver_array[1]) return true
    if(newver_array[2] > nowver_array[2]) return true
    return false
  }
}

module.exports = checknew