var config = require("../config");
var runClean = require("./clean");
var runBuild = require("./build");
var run = require("./run");

function outputHeader() {
    console.info("Building " + config.configuration + " configuration for target " + config.compileTarget);
}

function runCompiler(compiler) {
    compiler.run(function (err, stats) {
        if (stats) {
            let statsMessage = stats.toString({
                colors: true,
                modules: true,
                children: true,
                chunks: true,
                chunkModules: false
            }) + "\n";

            console.log(statsMessage);

            const info = stats.toJson();

            if (stats.hasErrors()) {
                for (let index = 0; index < info.errors.length; index++) {
                    console.error("\x1b[31m%s\x1b[0m", info.errors[index]);
                }
            }

            if (stats.hasWarnings()) {
                for (let index = 0; index < info.warnings.length; index++) {
                    console.error("\x1b[33m%s\x1b[0m", info.warnings[index]);
                }
            }

            if (!stats.hasErrors()
                && !stats.hasWarnings()) {
                console.error("\x1b[32m%s\x1b[0m", "Build successfully completed");
            }
        }
    
        if (err) {
            console.error(err.stack || err);

            if (err.details) {
                console.error(err.details);
            }

            return;
        }
    });
}

module.exports = {
    clean: function() {
        outputHeader();
        runClean();
        
        return "Build completed";
    },
    build: function() {
        outputHeader();
        var compiler = runBuild();

        runCompiler(compiler);
        
        return "Build completed";
    },
    rebuild: function() {
        outputHeader();
        runClean();
        var compiler = runBuild();

        runCompiler(compiler);
        
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