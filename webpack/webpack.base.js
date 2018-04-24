const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const WebpackLaravelMixManifest = require('webpack-laravel-mix-manifest').default;

function rootdir(subpath = '') {
    return path.resolve(__dirname, '../', subpath);
}

const entry = {
    'app': rootdir('resources/client/app.main'),
};

module.exports = (
    isTesting = false,
    filename = '[name]',
    chunkFilename = '[name]'
) => ({
    entry,
    output: {
        filename: `js/${chunkFilename}.js`,
        chunkFilename: `js/${chunkFilename}.js`,
        path: rootdir('public'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.ts', '.css', '.scss', '.pug'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@script': rootdir('resources/assets/js'),
            '@style': rootdir('resources/assets/sass'),
            '@img': rootdir('resources/assets/img'),
            '@app': rootdir('resources/client'),
        },
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            options: {
                transpileOnly: isTesting,
                errorsAsWarnings: true,
            },
        }, {
            test: /\.pug$/,
            loader: 'pug-loader',
            options: {
                root: '@app',
            },
        }, {
            test: /\.gif$/,
            loader: 'url-loader',
        }, {
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'file-loader',
            options: {
                name: `[name].[ext]`,
                outputPath: 'fonts/',
            },
        }, {
            test: /\.(jpg|jpeg|svg|png)$/,
            loader: 'file-loader',
            options: {
                name: `[name].[ext]`,
                outputPath: 'img/',
            },
        }],
    },
    plugins: [
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) return chunk.name;
            return chunk.modules.map(m => path.relative(m.context, m.request)).join('_');
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'core',
            filename: `js/${filename}.js`,
            chunks: Object.keys(entry),
            minChunks: 2,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new CleanWebpackPlugin([
            'public/css',
            'public/fonts',
            'public/img',
            'public/js',
            'public/mix-manifest.json',
            'public/assets.json',
            'public/stats.json',
            'public/stats.html',
        ], {
            root: rootdir(),
            allowExternal: true,
            verbose: true,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
        new WebpackLaravelMixManifest(),
    ],
    node: {
        fs: false,
        Buffer: false,
    },
});
