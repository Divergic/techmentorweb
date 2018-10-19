const config = require("../config");
const webpackServerConfig = require("../server/config/webpack");
const webpackClientConfig = require("../client/config/webpack");
const webpack = require("webpack");
const path = require("path");
const fs = require('fs-extra');

module.exports = function() {
    console.log("Building website");

    let compilerConfiguration;

    if (config.compileTarget === "hosted") {
        console.log("Copying server node_modules to dist");
        fs.ensureDir("./dist/node_modules/");
        fs.copy('./server/node_modules/', './dist/node_modules/', err =>{
                if(err) return console.error(err);
            });
            
        console.log("Copying web.config to dist");
        fs.copy('./web.config', './dist/web.config', err =>{
                if(err) return console.error(err);
            });
    }
    
    if (config.selfHost) {
        // We are using the webpack dev middleware which will provide the server implementation
        // We are not going to compile the server
        compilerConfiguration = webpackClientConfig;

        webpackClientConfig.entry.app.unshift("webpack/hot/dev-server");

        let hotReloadClientConfig = "webpack-hot-middleware/client?http://localhost:" + config.port;

        webpackClientConfig.entry.app.unshift(hotReloadClientConfig);

        webpackClientConfig.plugins.push(new webpack.NamedModulesPlugin());
        webpackClientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    else {
        // We are going to build both the client and the server
        compilerConfiguration = [webpackClientConfig, webpackServerConfig];
    }

    try {
        let webpackCompiler = webpack(compilerConfiguration);
        
        return webpackCompiler;
    }
    catch (error) {
        console.log("Failed to compile webpack")
        console.error(error);
    }   
};