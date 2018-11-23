var _ = require('lodash');
var Path = require('path');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DefinePlugin = Webpack.DefinePlugin;
var SourceMapDevToolPlugin = Webpack.SourceMapDevToolPlugin;
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var event = process.env.npm_lifecycle_event;

module.exports = {
    context: Path.resolve('./src'),
    entry: './main',
    output: {
        path: Path.resolve('./www'),
        filename: 'app.js',
    },
    resolve: {
        extensions: [ '.js', '.jsx' ],
        modules: [ Path.resolve('./src'), Path.resolve('./node_modules') ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        'babel-preset-es2015',
                    ],
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: 'css-loader',
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: 'css-loader!sass-loader',
                })
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                loader: 'file-loader',
            },
        ]
    },
    plugins: [
        new SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
        new HtmlWebpackPlugin({
            template: Path.resolve(`./src/index.html`),
            filename: Path.resolve(`./www/index.html`),
        }),
        new ExtractTextPlugin('styles.css'),
    ],
    devtool: (event === 'build') ? 'inline-source-map' : false,
    devServer: {
        inline: true,
    }
};

var constants = {};
if (event === 'build') {
    console.log('Optimizing JS code');

    // set NODE_ENV to production
    var plugins = module.exports.plugins;
    var constants = {
        'process.env.NODE_ENV': '"production"',
        'process.env.INCLUDE_DISPLAY_NAME': 'true'
    };
    plugins.unshift(new DefinePlugin(constants));

    // use Uglify to remove dead-code
    plugins.unshift(new UglifyJSPlugin({
        uglifyOptions: {
            compress: {
              drop_console: true,
            }
        }
    }));
}
