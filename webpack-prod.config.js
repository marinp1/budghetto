const commonConfig = require('./webpack-common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


const prodLoaders = [
  // javascript/jsx loader - https://www.npmjs.com/package/babel-loader - without the react-hot loader
  {
    test: /\.js?$/,
    exclude: /node_modules/,
    loaders: ['babel-loader'],
  }
];

module.exports = {
  entry: [
  './app/main.js'
  ],
  output: {
    path: './build',
    filename: 'bundle.[hash].js'
  },
  devtool:'source-map',
  devServer: {
    proxy: {
      '/api/*': 'http://localhost:4040/'
    }
  },
  module: {
    loaders: commonConfig.loaders.concat(prodLoaders)
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    commonConfig.indexPagePlugin
  ],
};
