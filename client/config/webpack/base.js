const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VendorChunkPlugin = require("webpack-vendor-chunk-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require("../../../config");

const rootPath = path.join(__dirname, "../../../");
const sourcePath = path.join(__dirname, "../../src");

const extractSass = new ExtractTextPlugin({
    filename: "content/[name].css",
});

let plugins = [
    new webpack.DefinePlugin(
    { 
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
    new webpack.optimize.CommonsChunkPlugin({names: ["vendor", "vendorauth"], filename: 'scripts/[name].js'}),
    new HtmlWebpackPlugin({
        hash: true,
        filename: "index.html",
        template: path.join(sourcePath, "/index.html"),
    }),
    extractSass
];

if (config.configuration === "release") {
    let uglify = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    });

    plugins.push(uglify);
}

module.exports = {
    name: "client",
    target: "web",
    entry: {
        app: [path.join(sourcePath, "/index.ts")],
        vendor: ["vue", "vuex", "vue-router", "vuex-persistedstate", "vee-validate", "store", "iziToast", "axios", "es6-promise/auto", "vue-class-component"]
    },
    output: {
        chunkFilename: 'scripts/[name].js',
        path: path.join(rootPath, "/dist"),
        publicPath: "/",
        filename: "scripts/[name].js"
    },
    devtool: "source-map",
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
                    emitErrors: true,
                    failOnHint: true,
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
                test: /\.scss$/,
                loader: extractSass.extract({
                    use: 
                    [
                        {
                            loader: "css-loader"
                        }, 
                        {
                            loader: "sass-loader"
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "images/[name].[ext]?[hash:7]"
                }
            }
        ]
    },
    plugins: plugins
};