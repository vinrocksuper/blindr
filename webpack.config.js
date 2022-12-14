const path = require('path');

module.exports = {
  entry: {
    profile: './client/profile.jsx',
    login: './client/login.jsx',
    ftue: './client/setup.jsx',
    socket: './client/socket.jsx',
    nav: './client/navbar.jsx',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx).$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode: 'production',
  watchOptions: {
    aggregateTimeout: 200,
  },
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: '[name]Bundle.js',
  },
};
