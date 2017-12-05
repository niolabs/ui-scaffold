/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin'); // uncomment this if you place any files into assets/static
/* eslint-enable import/no-extraneous-dependencies */

module.exports = {
  entry: path.join(__dirname, 'assets/index.js'),

  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: 3008,
    historyApiFallback: true,
    filename: '[chunkhash].min.js',
    https: true,
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    new HtmlWebpackPlugin({ template: path.join(__dirname, 'assets/index.html'), favicon: path.join(__dirname, 'assets/favicon.ico'), inject: 'body', minify: { collapseWhitespace: true, collapseInlineTagWhitespace: true, removeComments: true, removeRedundantAttributes: true } }),
    new ExtractTextPlugin('[contenthash].min.css'),
    // new CopyWebpackPlugin([{ from: 'assets/static' }]), // uncomment this if you place any files into assets/static
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        include: [/\.(ttf|woff|woff2|eot|svg)$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?importLoaders=1', 'sass-loader'],
        }),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      },
    ],
  },
};
