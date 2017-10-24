const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const nodeExternals = require('webpack-node-externals');
const config = require("../../config");

const modulesPath = path.join(__dirname, "../node_modules");

console.log("Building server using " + modulesPath);

let externalModules = [nodeExternals({
    modulesDir: modulesPath
})];

module.exports = {
    name: "server",
    target: "node",
    entry: path.join(__dirname, "../src/host.js"),
    node: {
    __dirname: false
    },
    output: {
        path: path.join(__dirname, "../../dist"),
        publicPath: "/",
        filename: "server.js"
    },
    plugins: [
        new webpack.DefinePlugin(
        { 
            "webpackDefine": {
                "environment": JSON.stringify(config.environment),
                "configuration": JSON.stringify(config.configuration),
                "port": config.port,
                "apiUri": JSON.stringify(config.apiUri),
                "applicationInsightsKey": JSON.stringify(config.serverApplicationInsightsKey)
            } 
        }),
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin(
            {
                banner: "require('source-map-support').install();",
                raw: true, 
                entryOnly: false 
            })
    ],
    externals: externalModules,
    devtool: "sourcemap"
};