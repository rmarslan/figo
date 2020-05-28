const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

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
        publicPath: '/'
    },

    devServer: {
        contentBase: './dist',
        hot: true,
        index: 'home.html'
    },

    mode: 'development',
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
                    'style-loader',
                    'css-loader',
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

    devtool: 'cheap-module-eval-source-map',

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'windows.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        })
    ]
    .concat(htmlPlugins)
}