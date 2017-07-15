const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  loaders: [
    // image loader - https://www.npmjs.com/package/image-webpack-loader
    {
      test: /\.(jpe?g|png|gif|svg|ico)$/i,
      loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    },
    // javascript/jsx loader - https://www.npmjs.com/package/babel-loader
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    },
    // styles
    {
      test: /\.[s]?css$/,
      loader: "style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!sass-loader"
    },
    // and font files - embed them if possible
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff2"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"
    }
  ],
  indexPagePlugin: new HtmlWebpackPlugin({
    inject: true,
    title: 'Budghetto',
    filename: 'index.html',
    template: path.resolve(__dirname, 'app/index_template.html')
  })
};