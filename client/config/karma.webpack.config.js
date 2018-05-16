const webpack = require("webpack");
const path = require("path");
const config = require("../../config");

const rootPath = path.join(__dirname, "../../");

module.exports = {
    name: "karma",
    target: "web",
    output: {
        filename: "test/specs.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".vue", ".js"]
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules|vue\/src/,
                loader: "ts-loader",
                options: {
                    configFile: path.join(rootPath, "tsconfig.json"),
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                esModule: true
              }
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
                options: {
                    classPrefix: true,
                    idPrefix: true,
                    removeSVGTagAttrs: true
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(
        { 
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "webpackDefine": {
                "environment": JSON.stringify(config.environment),
                "apiUri": JSON.stringify(config.apiUri),
                "audience": JSON.stringify(config.authAudience),
                "authDomain": JSON.stringify(config.authDomain),
                "clientId": JSON.stringify(config.authClientId),
                "responseType": JSON.stringify(config.authResponseType),
                "scope": JSON.stringify(config.authScope),
                "applicationInsightsKey": JSON.stringify(config.clientApplicationInsightsKey)
            } 
        })
    ]
};