const {join} = require('path');

module.exports = {
  babel: {
    plugins: [
      join(__dirname, '..', 'src', 'style-loader'),
    ],
  },
  stubs: {
    server: [
      /\.(c|s[ac])ss$/,
    ],
  },
};
