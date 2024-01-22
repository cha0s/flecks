// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// eslint-disable-next-line import/no-extraneous-dependencies
const {configDefaults} = require('@flecks/dox/build/docusaurus');

module.exports = async function flecksDocusaurus() {
  const defaults = configDefaults();
  /** @type {import('@docusaurus/types').Config} */
  const config = {
    ...defaults,
    title: 'My documentation website',
    tagline: 'built with flecks',
    url: 'http://localhost',
    baseUrl: '/',
  };
  return config;
};
