const defaultConfigFn = require('./default.eslint.config');
const Server = require('./server');

module.exports = defaultConfigFn(Server.from());
