// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
const {themes: prismThemes} = require('prism-react-renderer');

// For some reason we get a webpack warning if we use import here...
export default async function flecksDocusaurus() {
  /** @type {import('@docusaurus/types').Config} */
  const config = {
    baseUrl: '/flecks/',
    favicon: 'flecks.png',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },
    markdown: {
      mermaid: true,
    },
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    organizationName: 'cha0s', // Usually your GitHub org/user name.
    presets: [
      ['classic', {
        blog: {
          blogSidebarCount: 0,
        },
        docs: {
          sidebarPath: './sidebars.js',
        },
        pages: {
          path: 'pages',
        },
      }],
    ],
    projectName: 'flecks', // Usually your repo name.
    tagline: 'not static',
    themes: ['@docusaurus/theme-mermaid'],
    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        colorMode: {
          defaultMode: 'dark',
          respectPrefersColorScheme: false,
        },
        navbar: {
          title: 'flecks',
          logo: {
            alt: 'flecks logo',
            src: 'flecks-textless.png',
          },
          items: [
            {
              to: 'docs/',
              label: 'Docs',
              position: 'left',
            },
            {
              to: 'blog/',
              label: 'Blog',
              position: 'right',
            },
            {
              href: 'https://github.com/cha0s/flecks',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        prism: {
          theme: prismThemes.github,
          darkTheme: prismThemes.dracula,
        },
        footer: {
          style: 'dark',
          copyright: `Copyright © ${new Date().getFullYear()} cha0s. Built with flecks and Docusaurus.`,
        },
      }),
    title: 'flecks',
    url: 'https://cha0s.github.io',
  };
  return config;
}
