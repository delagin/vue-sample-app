const merge = require('webpack-merge');
const prod = require('./webpack.prod.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = () => merge(prod(), {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'stats.html',
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
        }),
    ],
});
