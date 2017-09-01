var webpack = require("webpack");
var path = require("path");
var fs = require("fs");

var nodeModules = {};

// Filer out node_modules for debug builds
fs.readdirSync("node_modules")
    .filter(function(x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

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
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin(
            {
                banner: "require('source-map-support').install();",
                raw: true, 
                entryOnly: false 
            })
    ],
    externals: nodeModules,
    devtool: "sourcemap"
};