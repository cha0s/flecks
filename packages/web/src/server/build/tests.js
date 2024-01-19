// eslint-disable-next-line import/no-extraneous-dependencies
require('source-map-support/register');

const mochaDiv = window.document.createElement('div');
mochaDiv.id = 'mocha';
window.document.body.appendChild(mochaDiv);

(async () => {
  await import('mocha/mocha.css');
  const mocha = await import('mocha/mocha');

  mocha.setup('bdd');

  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
  await import('@flecks/web/tests');

  mocha.run();

})();
