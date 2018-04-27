const config = require("../config");
const path = require("path");
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotServerMiddleware = require("webpack-hot-middleware");

module.exports = function(webpackCompiler) {

    if (config.selfHost) {
        // Simulate the functionality of the server in the webpack middleware
        const headers = require("../server/src/headers");
        const csp = require("../server/src/csp");
        const app = express();

        // Need to copy the reportUri logic found in serverConfig.js so that it can run under the local web server
        config.reportUri = "https://sentry.io/api/1195783/security/?sentry_key=025317d899744da5911331d72424adfa&sentry_environment=" + config.environment + (config.version ? "&sentry_release=" + config.version : "")

        app.use(headers(config));
        app.use(csp(config));

        app.use(webpackDevMiddleware(webpackCompiler, {
            lazy: false,
            noInfo: true,
            publicPath: "/",
            historyApiFallback: true,
            quiet: false,
            stats: {colors: true}
        }));

        app.use(webpackHotServerMiddleware(webpackCompiler, {
            log: console.log, 
            path: "/__webpack_hmr", 
            heartbeat: 10 * 1000
        }));

        app.use("*", function (req, res, next) {
            var filename = path.join(webpackCompiler.outputPath, "index.html");
            webpackCompiler.outputFileSystem.readFile(filename, function(err, result){
                if (err) {
                    return next(err);
                }

                res.set("content-type", "text/html");
                res.send(result);
                res.end();
            });
        });

        app.listen(config.port, function () {
            console.log("Website (" + config.configuration + " on " + config.compileTarget + ") listening on port " + config.port + " for path " + __dirname);
        });
    }
};