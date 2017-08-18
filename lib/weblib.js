/**
 * web
 */
const request = require('request')
const path = require('path')
const fs = require('fs')
const files = require('./files')


module.exports = {
  /**
   * GET获取url内容
   * 
   * @param {any} url 
   * @returns 
   */
  getWebFile(url){
    return new Promise((resolve, reject)=>{
      request(url, function (error, response, body) {
        if(error != null){
          reject(error)
        }
        else{
          resolve(body)
        }
      })
    })
  },
  getAndSaveWebFile(url, dest){
    files.createDirectory(dest)
    return new Promise((resolve, reject)=>{
      request
      .get(url)
      .on('error', function(err) {
        reject(err)
      })
      .pipe(fs.createWriteStream(
        dest
      ))
      .on('finish', function(){
        resolve()
      })
    })
  }
}