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
  }
};