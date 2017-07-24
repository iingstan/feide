var fs = require('fs');

module.exports = {
  getFilenameFromUrl : function(url){
    var lastxg = url.lastIndexOf('/');
    return url.substring(lastxg + 1);
  },
  getFilenameFromPath : function(url){
    var lastxg = url.lastIndexOf('\\');
    return url.substring(lastxg + 1);
  },
  getFilenameNoSuffixFromUrl : function(url){
    var filename = this.getFilenameFromPath(url);
    if(filename.lastIndexOf('.') > 0){
      return filename.substring(0, filename.lastIndexOf('.'));
    }
    return filename;
  },
  readBigFile: function(filepath, callback){
    var input = fs.createReadStream(filepath);
    var remaining = '';

    input.on('data', (chunk) => {
      //console.log(`Received ${chunk.length} bytes of data.`);
      remaining = remaining + chunk;
    });
    input.on('end', () => {
      //console.log('There will be no more data.');
      callback(remaining);
    });
  }
}