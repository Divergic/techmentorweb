const merge = require("webpack-merge");
const baseConfig = require("./base");
const targetConfig = require("./" + baseConfig.compileTarget);

const config = merge(baseConfig, targetConfig);

module.exports = config;