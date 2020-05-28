const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function generateHtmlPlugins (templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
    return templateFiles.map(item => {
            const parts = item.split('.')
            const name = parts[0]
            const extension = parts[1]
            return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
        })
    })
}

const htmlPlugins = generateHtmlPlugins('../src/templates/pages');

module.exports = {
    entry: {
        main: './src/js/index.js'
    },
    
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        publicPath: './'
    },

    mode: 'production',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|vendors)/,
                loader: 'babel-loader'
            },

            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: false
                        } 
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.html$/,
                use: 'html-loader'
            },

            {
                test: /\.(png|svg|jpeg|jpg|gif)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                    esModule: false
                },
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                        },
                    }
                ]
            },

            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                    }
                ]
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'windows.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        })
    ]
    .concat(htmlPlugins)
}