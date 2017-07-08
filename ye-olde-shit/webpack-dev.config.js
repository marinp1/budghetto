const commonConfig = require('./webpack-common.config.js');
const path = require('path');

const devLoaders = [
  // javascript/jsx loader - https://www.npmjs.com/package/babel-loader - with the react-hot loader
  {
    test: /\.js?$/,
    exclude: /node_modules/,
    loaders: ['babel-loader']
  }
];

module.exports = {
  entry: [
  // setup the hot mobule loading
  'webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/only-dev-server',
  // our entry file
  './app/main.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[hash].js'
  },
  devtool: 'eval',
  devServer: {
    // proxy calls to api to our own node server backend
    proxy: {
      '/api/*': 'http://localhost:4040/'
    }
  },
  module: {
    rules: commonConfig.loaders.concat(devLoaders)
  },
  plugins: [
    commonConfig.indexPagePlugin
  ],
};
