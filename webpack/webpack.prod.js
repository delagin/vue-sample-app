const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

function rootdir(subpath = '') {
    return path.resolve(__dirname, '../', subpath);
}

const baseArgs = [
    false,
    '[name].[hash:8]',
    '[name].[chunkhash:8]',
];

module.exports = () => merge(base(...baseArgs), {
    module: {
        rules: [{
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: {
                                discardComments: {
                                    removeAll: true,
                                },
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer,
                            ],
                        },
                    },
                    'sass-loader',
                ],
            }),
        }, {
            test: /\.style\.css$/,
            loader: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            camelCase: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[hash:base64:8]',
                            minimize: {
                                discardComments: {
                                    removeAll: true,
                                },
                            },
                        }
                    },
                    'postcss-loader',
                ],
            }),
        }],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        new UglifyJSPlugin({
            parallel: true,
            extractComments: true,
        }),
        new AssetsPlugin({
            filename: 'assets.json',
            path: rootdir('public'),
            prettyPrint: true,
        }),
        new HardSourceWebpackPlugin({
            cacheDirectory: process.env.WEBPACK_HARD_SOURCE_CACHE_DIR,
        }),
    ],
});
