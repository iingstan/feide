var jsonfile = require('jsonfile');
var path = require('path');

module.exports = {
  save: function(json){
    jsonfile.writeFileSync(path.join(global.workdir, 'feide.config.json'), json, {spaces: 2});
  },
  get: function(){
    return jsonfile.readFileSync('../feide.config.json');
  }
}