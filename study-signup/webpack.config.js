'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');


const isProd = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: (! isProd)
});

module.exports = {

    entry: [
        './index.js',
    ],

    output: {
        path: path.resolve(__dirname, '__build__'),
        filename: 'index_signup_bundle.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }, {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [autoprefixer("last 2 versions")]
                            }
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            includePaths: ["./node_modules/", "./resources/scss/"],
                        }
                    }],

                    fallback: "style-loader"
                }),
            }, {
                test: /\.(jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'resources'),
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:8].[ext]',
                        }
                    }
                ]
            }, {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },

    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            title: 'Website Usability Study',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin([
            {
                from: "./resources/img",
                to: "img"
            }
        ]),
    ],

    devServer: {
        compress: true,
        port: 4001,
        hot: true,
        historyApiFallback: true,
        publicPath: 'http://localhost:4001/',
        contentBase: [
            path.join(__dirname, "__build__"),
            path.join(__dirname, 'resources')
        ],
        disableHostCheck: true,
    }

}
