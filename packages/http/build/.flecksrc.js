const {join} = require('path');

module.exports = {
  babel: {
    plugins: [
      join(__dirname, '..', 'src', 'server', 'style-loader'),
    ],
  },
  stubs: {
    server: [
      /\.(c|s[ac])ss$/,
    ],
  },
};
