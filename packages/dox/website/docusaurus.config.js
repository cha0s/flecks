// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// For some reason we get a webpack warning if we use import here...
const {configDefaults} = require('@flecks/dox/server'); // eslint-disable-line import/no-extraneous-dependencies

export default async function flecksDocusaurus() {
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
}
