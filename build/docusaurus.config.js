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
    title: 'flecks',
    tagline: 'not static',
    favicon: 'flecks.png',
    url: 'https://cha0s.github.io',
    baseUrl: '/flecks/',
    organizationName: 'cha0s', // Usually your GitHub org/user name.
    projectName: 'flecks', // Usually your repo name.
    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        ...defaults.themeConfig,
        navbar: {
          title: 'flecks',
          logo: {
            alt: 'flecks logo',
            src: 'flecks.png',
          },
          items: [
            {
              href: 'https://github.com/cha0s/flecks',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          copyright: `Copyright © ${new Date().getFullYear()} cha0s. Built with Docusaurus.`,
        },
      }),
  };
  return config;
}
