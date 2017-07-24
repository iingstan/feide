/**
 * json result
 */

class jsonresult{
  /**
   * json result
   * @param {boolean} re 返回是否成功
   * @param {string} message 失败信息
   * @param {object} result 返回内容
   * 
   * @memberof jsonresult
   */
  constructor(re, message, result){
    
    this.re = re;
    this.message = message;
    this.result = result;
  }
}

module.exports = jsonresult