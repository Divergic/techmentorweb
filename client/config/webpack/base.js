const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VendorChunkPlugin = require("webpack-vendor-chunk-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = require("../../../config");

const rootPath = path.join(__dirname, "../../../");
const sourcePath = path.join(__dirname, "../../src");

const mode = config.configuration === "release" ? "production" : "development";
const devtool = config.configuration === "release" ? "hidden-source-map" : "source-map";

console.log("Compiling for " + mode + " with devtool " + devtool + " for the client");

let webpackConfig = {
    name: "client",
    target: "web",
    mode: mode,
    entry: {
        app: [path.join(sourcePath, "/index.ts")]
    },
    optimization: {
        runtimeChunk: true,
        namedModules: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "initial"
                }
            }
        }
    },
    output: {
        chunkFilename: "scripts/[name].js?hash=[hash:7]",
        path: path.join(rootPath, "/dist"),
        publicPath: "/",
        filename: "scripts/[name].js?hash=[hash:7]"
    },
    devtool: devtool,
    resolve: {
        extensions: [".ts", ".vue", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
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
                loader: "vue-loader",
                options: {
                    esModule: true
                }
            },
            {
                test: /\.styl$/,
                loader: "css-loader!stylus-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", 
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader",
                options: {
                    classPrefix: true,
                    idPrefix: true,
                    removeSVGTagAttrs: true
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "images/[name].[ext]?hash=[hash:7]"
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(
        { 
            "webpackDefine": {
                "apiUri": JSON.stringify(config.apiUri),
                "applicationInsightsKey": JSON.stringify(config.clientApplicationInsightsKey),
                "audience": JSON.stringify(config.authAudience),
                "authDomain": JSON.stringify(config.authDomain),
                "clientId": JSON.stringify(config.authClientId),
                "configuration": JSON.stringify(config.configuration),
                "environment": JSON.stringify(config.environment),
                "responseType": JSON.stringify(config.authResponseType),
                "scope": JSON.stringify(config.authScope),
                "sentryDsn": JSON.stringify(config.sentryDsn),
                "version": JSON.stringify(config.version)
            } 
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: "index.html",
            template: path.join(sourcePath, "/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "content/[name].css?hash=[hash:7]",
        })
    ]
};

module.exports = webpackConfig;