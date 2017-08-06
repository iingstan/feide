/**
 * 文件列表
 */
const glob = require("multi-glob").glob;

module.exports = {
  getFromDisk(){
    return new Promise((resolve, reject)=>{
      let pattern = ["./+(css|js|libs|page)/**/*.*", "./feide.config.json"];
      glob(pattern, {
        //ignored: /node_modules|\.git|\.svn/
      }, function (error, files) {
        if(error != null){
          reject(error)
        }
        else{
          resolve(files);
        }
      })
    })
  },
  getFromMemory(){
    
  }
}