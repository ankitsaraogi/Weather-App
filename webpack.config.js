var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./app/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
		{ test: /\.(js)$/, use: [{loader: 'babel-loader'}],
        exclude: /node_modules/},
		{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
		{test: /\.(eot|png|svg|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader'}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ],
  devtool: "#source-map",
  devServer:{
    contentBase:'.',
    compress:true,
    historyApiFallback:{
        index:'/'
    }
  }
};
