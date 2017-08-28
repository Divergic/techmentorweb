const webpack = require("webpack");
const path = require("path");
const config = require("../../config");

const rootPath = path.join(__dirname, "../../");

module.exports = {
    name: "karma",
    target: "node",
    output: {
        filename: "test/specs.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules|vue\/src/,
                loader: "ts-loader",
                options: {
                    configFile: rootPath + "/tsconfig.json",
                    emitErrors: true,
                    failOnHint: true,
                    appendTsSuffixTo: [/\.vue$/]
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
                    "authorizeUri": JSON.stringify(config.authAuthorizeUri),
                    "clientId": JSON.stringify(config.authClientId),
                    "responseType": JSON.stringify(config.authResponseType),
                    "scope": JSON.stringify(config.authScope),
                    "sentryUri": JSON.stringify(config.clientSentryUri)
                } 
            }),
    ]
};