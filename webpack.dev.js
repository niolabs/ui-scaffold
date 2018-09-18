/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const autoprefixer = require('autoprefixer');
const postCssFlexbugFixes = require('postcss-flexbugs-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = {
  entry: ['@babel/polyfill', path.join(__dirname, 'assets/index.js')],

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[chunkhash].min.js',
    publicPath: '/',
  },

  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    filename: '[chunkhash].min.js',
    https: true,
    disableHostCheck: true,
    inline: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'assets/index.html'),
      favicon: path.join(__dirname, 'assets/favicon.ico'),
      inject: 'body',
    }),
    new ExtractTextPlugin('[chunkhash].min.css'),
    new OptimizeCssAssetsPlugin({ assetNameRegExp: /\.css$/g, cssProcessorOptions: { discardComments: { removeAll: true } }, canPrint: true }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '/assets/images/'), to: 'images/' },
      { from: path.join(__dirname, '/assets/fonts/'), to: 'fonts/' },
    ]),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
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
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                plugins: () => [
                  postCssFlexbugFixes,
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
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
