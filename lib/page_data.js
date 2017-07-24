/**
 * 页面数据
 */
const path = require('path');
const exists = require('fs-exists-sync');
const jsonfile = require('jsonfile');
let files = require('./files');
const _ = require('lodash');
const fs = require('fs');

module.exports = {
  getDataPath: function(filepath){
    let basename = path.basename(filepath, '.hbs');
    return path.join(path.dirname(filepath), basename + '.json');
  },
  create: function(filepath){
    
  },
  save: function(filepath, data){
    let datafile_path = this.getDataPath(filepath);
    let filedata = {};
    if(files.exists(datafile_path)){
      filedata = jsonfile.readFileSync(datafile_path);
    }
    filedata = _.extend(filedata, data);
    jsonfile.writeFileSync(datafile_path, filedata, {spaces: 2});
  },
  del: function(filepath){
    let datafile_path = this.getDataPath(filepath);
    if(files.exists(datafile_path)){
      fs.unlinkSync(datafile_path)
    }
  },
  get: function(filepath){
    let datafile_path = this.getDataPath(filepath);
    if(files.exists(datafile_path)){
      return jsonfile.readFileSync(datafile_path);
    }
    else{
      return {};
    }
  }
}