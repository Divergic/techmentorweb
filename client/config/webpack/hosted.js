var webpack = require("webpack");
const config = require("../../../config");

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {    
                // Set to production configuration for vue.js compilation
                NODE_ENV: '"production"'
            }
        })
    ],
};