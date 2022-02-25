const mochaDiv = window.document.createElement('div');
mochaDiv.id = 'mocha';
window.document.body.appendChild(mochaDiv);

require('mocha/mocha.css').use();
const mocha = require('mocha/mocha');

mocha.setup('bdd');

// eslint-disable-next-line import/no-unresolved
__non_webpack_require__('@flecks/http/tests');

mocha.run();
