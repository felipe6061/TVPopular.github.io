module.exports = {
    entry: './js/script.js',
    output: {
      path: './public',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }
  };