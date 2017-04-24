let webpack = require('webpack');
let baseConfig = Object.assign({}, require('./webpack.config.base'));

baseConfig.devtool = "cheap-eval-source-map";

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    })
];

module.exports = baseConfig;