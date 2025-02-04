const { merge } = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');
const build = require('../build.json');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve('dist')
        },
        hot: true,
        // compress: true,
        port: 8080,
        allowedHosts: 'all',
        open: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/index.html'),
            inlineSource: '.(js|css|png|jpg|svg|mp3|gif)$'
        }),

        new webpack.DefinePlugin({
            GOOGLE_PLAY_URL: JSON.stringify(build.google_play_url || ''),
            APP_STORE_URL: JSON.stringify(build.app_store_url || ''),
            AD_NETWORK: JSON.stringify('preview'),
            __DEV: JSON.stringify(true)
        })
    ]
});
