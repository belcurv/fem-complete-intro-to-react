const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,   // run webpack from root directory only
  entry: [
    // orient webpack to run from server.js
    "webpack-hot-middleware/client?path=__webpack_hmr&timeout=2000",
    "./js/ClientApp.jsx"
  ],
  devtool: "cheap-eval-source-map", // inline sourcemaps in bundle
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  devServer: {
    hot: true,
    publicPath: '/public/',
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']  // order of resolution of file extensions
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  }
}