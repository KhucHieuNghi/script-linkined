const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var IncludeAssetsHtmlWebpackPlugin = require('include-assets-html-webpack-plugin');
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");

const ROOT_DIRECTORY = process.cwd();

module.exports = {
  mode: 'development',
  entry: {
  main: path.resolve(ROOT_DIRECTORY, 'script/index.js'),
  },
  output: {
    path: path.resolve(ROOT_DIRECTORY, 'build'),
    filename: 'bundle.js',
    chunkFilename: 'chunk.js',
    asyncChunks: true,
  },
  devServer: {
    compress: true,
    port: 3000,
    client: {
      overlay: true,
    },
    static: {
      directory: path.join(ROOT_DIRECTORY, 'public'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            configFile: path.resolve(ROOT_DIRECTORY, 'config/babel.config.js')
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_DIRECTORY, 'script/index.html'),
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "public/*",
          to: "[name][ext]",
        },
        {
          from: "script/manifest.json",
          to: "[name][ext]",
        },
      ],
    }),
  ]
}
