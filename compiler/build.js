const config = require("../config");
const webpackServerConfig = require("../server/config/webpack");
const webpackClientConfig = require("../client/config/webpack");
const webpack = require("webpack");
const path = require("path");

module.exports = function() {
    console.log("Building website");

    let compilerConfiguration;

    if (config.selfHost) {
        // We are using the webpack dev middleware which will provide the server implementation
        // We are not going to compile the server
        compilerConfiguration = webpackClientConfig;

        webpackClientConfig.entry.app.unshift("webpack/hot/dev-server");
        webpackClientConfig.entry.vendor.unshift("webpack/hot/dev-server");

        let hotReloadClientConfig = "webpack-hot-middleware/client?http://localhost:" + config.port;

        webpackClientConfig.entry.app.unshift(hotReloadClientConfig);
        webpackClientConfig.entry.vendor.unshift(hotReloadClientConfig);

        webpackClientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    else {
        // We are going to build both the client and the server
        compilerConfiguration = [webpackClientConfig, webpackServerConfig];
    }

    try {
        let webpackCompiler = webpack(compilerConfiguration, function (err, stats) {
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
        
        return webpackCompiler;
    }
    catch (error) {
        console.log("Failed to compile webpack")
        console.error(error);
    }   
};