const {mkdir, writeFile} = require('fs/promises');
const {isAbsolute, join, resolve} = require('path');

const {spawnWith} = require('@flecks/core/server');
const {themes: prismThemes} = require('prism-react-renderer');
const {rimraf} = require('rimraf');

const {
  generateBuildConfigsPage,
  generateConfigPage,
  generateHookPage,
  generateTodoPage,
} = require('./generate');
const {parseFlecks} = require('./parser');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.configDefaults = function configDefaults() {
  /** @type {import('@docusaurus/types').Config} */
  const config = {
    tagline: 'built with flecks',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },
    presets: [
      ['classic', {
        docs: {
          sidebarPath: './sidebars.js',
        },
        pages: {
          path: 'pages',
        },
      }],
    ],
    themeConfig: {
      footer: {
        style: 'dark',
        copyright: 'Built with flecks and Docusaurus.',
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    },
  };
  return config;
};

exports.resolveSiteDir = function resolveSiteDir(siteDir) {
  return isAbsolute(siteDir)
    ? siteDir
    : resolve(FLECKS_CORE_ROOT, siteDir);
};

exports.generate = async function generate(flecks, siteDir) {
  // Generate "docs".
  const docsDirectory = join(siteDir, 'docs', 'flecks');
  await rimraf(docsDirectory);
  const generatedDirectory = join(docsDirectory, '@flecks', 'dox');
  await mkdir(generatedDirectory, {recursive: true});
  const state = await parseFlecks(flecks);
  const hookPage = generateHookPage(state.hooks, flecks);
  const todoPage = generateTodoPage(state.todos, flecks);
  const buildConfigsPage = generateBuildConfigsPage(state.buildConfigs);
  const configPage = generateConfigPage(state.configs);
  await writeFile(join(generatedDirectory, 'hooks.md'), hookPage);
  await writeFile(join(generatedDirectory, 'TODO.md'), todoPage);
  await writeFile(join(generatedDirectory, 'build-configs.md'), buildConfigsPage);
  await writeFile(join(generatedDirectory, 'config.mdx'), configPage);
};

exports.spawn = function spawn(subcommand, siteDir) {
  const args = [];
  switch (subcommand) {
    case 'start':
      args.push('start', '--no-open');
      break;
    case 'build':
      args.push('build', '--out-dir', join(FLECKS_CORE_ROOT, 'dist', 'dox'));
      break;
    default: {
      const docusaurusCall = `npx docusaurus <subcommand> --config ${join(FLECKS_CORE_ROOT, 'build', 'docusaurus.config.js')}`;
      throw new Error(`@flecks/dox only supports the 'build' and 'start' subcommands. You can run docusaurus yourself with:\n\n${docusaurusCall}`);
    }
  }
  args.push('--config', join(FLECKS_CORE_ROOT, 'build', 'docusaurus.config.js'));
  const cacheDirectory = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'dox');
  // Spawn `docusaurus`.
  const cmd = [
    // `npx` doesn't propagate signals!
    // 'npx', 'docusaurus',
    join(FLECKS_CORE_ROOT, 'node_modules', '.bin', 'docusaurus'),
    ...args,
    siteDir,
  ];
  const child = spawnWith(
    cmd,
    {
      env: {
        // Override docusaurus generation directory for cleanliness.
        DOCUSAURUS_GENERATED_FILES_DIR_NAME: join(cacheDirectory, '.docusaurus'),
      },
    },
  );
  // Clean up on exit.
  process.on('exit', () => {
    child.kill();
  });
  return child;
};
