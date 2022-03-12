const {join} = require('path');

module.exports = {
  aliases: {
    'react-dom': '@hot-loader/react-dom',
  },
  babel: {
    plugins: [
      join(__dirname, '..', 'style-loader'),
    ],
    presets: [
      '@babel/preset-react',
    ],
  },
};
