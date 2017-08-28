var fs = require("fs");
var path = require("path");

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function() {
    console.log("Removing previous build");

    let outputPath = path.join(__dirname, "../dist");

    deleteFolderRecursive(outputPath);

    console.log("Cleaned build");
};