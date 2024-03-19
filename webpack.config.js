module.exports =  {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  entry: './app.js',
  target: 'node',
  output: {
    filename: 'app.js',
    clean: true
  }
}