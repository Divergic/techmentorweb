var config = require("../config");
var runClean = require("./clean");
var runBuild = require("./build");
var run = require("./run");

function outputHeader() {
    console.info("Building " + config.configuration + " configuration for target " + config.compileTarget);
}

module.exports = {
    clean: function() {
        outputHeader();
        runClean();
        
        return "Build completed";
    },
    build: function() {
        outputHeader();
        runBuild();
        
        return "Build completed";
    },
    rebuild: function() {
        outputHeader();
        runClean();
        runBuild();
        
        return "Build completed";
    },
    runServer: function() {
        outputHeader();
        runClean();
        var compiler = runBuild();

        run(compiler);
        
        return "Build completed";
    }
};

require("make-runnable");