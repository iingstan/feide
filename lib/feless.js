/**
 * fe less
 */
const fs = require("fs");
const path = require("path");
const less = require('less');

let feless = {
  lessToCss: function(filepath){
    return new Promise(function(resolve, reject){
      let cssfile;
      try {
        cssfile = fs.readFileSync(filepath, 'utf-8');
      } catch (error) {
        var err = new Error('Not Found');
        err.status = 404;
        throw err;
      }
      
      less.render(cssfile, {
          filename: path.resolve(filepath)
      }, function (e, output) {
          if(e != null){
              reject(e);
          }
          else{
            resolve(output.css);
          }
      });      
    });
  }
}

module.exports = feless;