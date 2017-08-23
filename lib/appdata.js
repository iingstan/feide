/**
 * appdata
 * 用户环境变量
 */

const files = require('./files')
const path = require('path')
const jsonfile = require('jsonfile')

module.exports = {
  datapath: path.join(process.env.APPDATA, 'feide', 'userdata.json'),
  /**
   * 保存
   * 
   * @param {any} json 
   */
  save(json){
    files.createDirectory(this.datapath)
    jsonfile.writeFileSync(this.datapath, json)
  },
  /**
   * 获取
   * 
   * @returns 
   */
  get(){
    if(!files.exists(this.datapath)){
      return {}
    }
    return jsonfile.readFileSync(this.datapath)
  }
}