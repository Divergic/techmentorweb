var fs = require("fs");
var path = require("path");

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        console.log("Removing " + curPath);
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    console.log("Removing " + path);
  }
};

module.exports = function() {
    console.log("Removing previous build");

    let outputPath = path.join(__dirname, "../dist");

    deleteFolderRecursive(outputPath);

    let testResultsPath = path.join(__dirname, "../TestResults");
  
    deleteFolderRecursive(testResultsPath);
    
    console.log("Cleaned build");
};