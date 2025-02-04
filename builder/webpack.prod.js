const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const build = require('../build.json');
const path = require('path');

const allowedNetworkNamesMap = {
    applovin: 'applovin'
};

let adNetwork = process.argv[process.argv.length - 1].trim();
if (!allowedNetworkNamesMap[adNetwork]) adNetwork = 'preview';

function getFileName() {
    return `${build.app}-${build.name}-v${build.version}-${
        allowedNetworkNamesMap[adNetwork] || 'preview'
    }.html`;
}

console.log(getFileName());

module.exports = merge(common, {
    mode: 'production',
    stats: 'errors-only',
    module: {
        parser: {
            javascript: {
                dynamicImportPreload: false,
                dynamicImportPrefetch: false,
                importMeta: false,
                import: true,
                importAsync: false
            }
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'main',
                    enforce: true
                },
                default: {
                    minChunks: 1,
                    name: 'main',
                    enforce: true
                }
            }
        },
        runtimeChunk: false,
        removeEmptyChunks: true,
        concatenateModules: true,

        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    safari10: true,
                    compress: {
                        drop_console: true,
                        arrows: false
                    },
                    output: {
                        comments: false,
                        quote_style: 3
                    }
                }
            })
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/index.html'),
            filename: getFileName(),
            title: `${build.name}-${build.app}`,
            inlineSource: '.(js|css|png|jpg|svg|mp3|gif)$',
            inject: 'body',
            scriptLoading: 'blocking',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: false
            }
        }),

        new HtmlInlineScriptPlugin(),

        new webpack.DefinePlugin({
            GOOGLE_PLAY_URL: JSON.stringify(build.google_play_url || ''),
            APP_STORE_URL: JSON.stringify(build.app_store_url || ''),
            // AD_NETWORK: JSON.stringify(adNetwork),
            __DEV__: JSON.stringify(false)
        })
    ]
});
