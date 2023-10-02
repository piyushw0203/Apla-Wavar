const path = require('path');

module.exports = {
    mode:'development',
  entry: './public/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
