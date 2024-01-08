const path = require("path");
const webpack = require("webpack");
const {TRUE} = require("sass");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    publicPath: path.resolve("./"),
    filename: "[name].js",
    clean: true,

  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test:/\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(svg|png|ico|jpg|PNG)$/,
        use: {loader: 'url-loader'}
    },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader','sass-loader'],
      }
    ],
  },

  optimization: {
    minimize: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};