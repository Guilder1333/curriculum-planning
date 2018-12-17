const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './public/', to: './' },
    ], { ignore: ['*.js', '*.scss', '*.sass'] })
  ]
};