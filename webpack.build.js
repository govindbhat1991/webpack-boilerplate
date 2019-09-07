const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');

const buildConf = {
    // Providing the mode configuration option tells webpack to use its built-in optimizations accordingly (available values - production, development)
    mode: "production",
    // Choose a style of source mapping to enhance the debugging process
    devtool: 'inline-source-map',
    entry: {
        'libs': ['./assets/js/libs.js'],
        'main': ['./assets/js/app.js'],
        // 'common': ['./assets/js/common.js'],
        // 'download': ['./assets/js/download.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // Set the name for of the output files
        filename: 'js/[name].js',
    },
    module: {
        // Tell webpack to load and compile all sass files, then add the css files and extract them according
        // to the plugins config
        rules: [
            {
                // Enables es6 syntax in .js files
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        ignore: [
                            "**/js/*.no.babel.change.js"
                          ]
                    }
                }
            },
            {
                test: /\.(s*)[ac]ss$/,
                //exclude: /node_modules/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,

                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')({
                                    'overrideBrowserslist': ['> 0.25%', 'not op_mini all']
                                })
                            ];
                        },
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }
                ]
            },
            {
                // copy all font files into the dist-production folder
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                exclude: [/images/],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath: '../'
                    }
                }]
            },
            {
                // copy all image files into the dist-production folder
                test: /\.(png|svg|jpg|gif)$/,
                exclude: [/fonts/],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        publicPath: '../'
                    }
                }]
            }
        ],
    },
    optimization:{
        //do the uglify
       minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCssAssetsPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            //combine .css into one css file
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        }),
        new webpack.ProvidePlugin({
        }),
        // This cleans the dist folder before each build, so that only used files will be available
        new CleanWebpackPlugin(['dist'])
    ]
}

module.exports = buildConf;
