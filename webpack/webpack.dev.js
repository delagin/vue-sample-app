const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (isTesting = false) => merge(base(isTesting), {
    module: {
        rules: [{
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                use: [
                    'css-loader',
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
                            localIdentName: '[name]__[local]--[hash:base64:4]',
                        }
                    },
                    'postcss-loader',
                ],
            }),
        }],
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),
    ],
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000,
    },
});
