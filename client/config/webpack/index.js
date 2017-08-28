const merge = require("webpack-merge");
const config = require("../../../config");
const baseConfig = require("./base");
const targetConfig = require("./" + config.compileTarget);

const webpackConfig = merge(baseConfig, targetConfig);

module.exports = webpackConfig;