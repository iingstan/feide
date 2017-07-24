/**
 * 加解密
 */

const crypto = require('crypto');
const fs = require('fs')

module.exports = {
  sha1(str) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(str);
    var res = sha1.digest("hex");
    return res;
  },
  sha1File(filepath){
    let file_content = fs.readFileSync(filepath, 'utf-8')
    return this.sha1(file_content)
  },
  checkFileSha1(filepath, sha1_value){
    return this.sha1File(filepath) === sha1_value
  }
}