const {mkdir, writeFile} = require('fs/promises');
const {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  resolve,
} = require('path');

const {spawnWith} = require('@flecks/core/server');
const {themes: prismThemes} = require('prism-react-renderer');
const {rimraf} = require('rimraf');

const {
  generateBuildFilesPage,
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
  const parsed = await parseFlecks(flecks);
  const {
    buildFiles,
    config,
    hooks,
    todos,
  } = parsed
    .reduce(
      (
        r,
        [
          root,
          sources,
        ],
      ) => {
        const ensureHook = (hook) => {
          if (!r.hooks[hook]) {
            r.hooks[hook] = {
              implementations: [],
              invocations: [],
              specification: undefined,
            };
          }
        };
        sources.forEach(
          (
            [
              path,
              {
                buildFiles = [],
                config = [],
                hookImplementations = [],
                hookInvocations = [],
                hookSpecifications = [],
                todos = [],
              },
            ],
          ) => {
            r.buildFiles.push(...buildFiles);
            r.todos.push(...todos.map((todo) => ({
              ...todo,
              filename: join(`**${root}**`, path),
            })));
            if (config.length > 0) {
              let fleck = root;
              if ('build/flecks.bootstrap.js' !== path) {
                fleck = join(fleck, path.startsWith('src') ? path.slice(4) : path);
                fleck = join(dirname(fleck), basename(fleck, extname(fleck)));
                fleck = fleck.endsWith('/index') ? fleck.slice(0, -6) : fleck;
              }
              r.config[fleck] = config;
            }
            hookImplementations.forEach(({column, hook, line}) => {
              ensureHook(hook);
              r.hooks[hook].implementations.push({
                column,
                filename: join(`**${root}**`, path),
                line,
              });
            });
            hookInvocations.forEach(({
              column,
              hook,
              line,
              type,
            }) => {
              ensureHook(hook);
              r.hooks[hook].invocations.push({
                column,
                filename: join(`**${root}**`, path),
                line,
                type,
              });
            });
            hookSpecifications.forEach(({
              hook,
              description,
              example,
              params,
            }) => {
              ensureHook(hook);
              r.hooks[hook].specification = {
                description,
                example,
                params,
              };
            });
          },
        );
        return r;
      },
      {
        buildFiles: [],
        config: {},
        hooks: {},
        todos: [],
      },
    );
  const sortedHooks = Object.fromEntries(
    Object.entries(hooks)
      .map(([hook, {implementations, invocations, specification}]) => (
        [
          hook,
          {
            implementations: implementations
              .sort(({filename: l}, {filename: r}) => (l < r ? -1 : 1)),
            invocations: invocations
              .sort(({filename: l}, {filename: r}) => (l < r ? -1 : 1)),
            specification,
          },
        ]
      ))
      .sort(([l], [r]) => (l < r ? -1 : 1)),
  );
  Object.entries(sortedHooks)
    .forEach(([hook, {specification}]) => {
      if (!specification) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: no specification for hook: '${hook}'`);
      }
    });
  const hookPage = generateHookPage(sortedHooks, flecks);
  const todoPage = generateTodoPage(todos, flecks);
  const buildFilesPage = generateBuildFilesPage(buildFiles);
  const configPage = generateConfigPage(config);
  await writeFile(join(generatedDirectory, 'hooks.mdx'), hookPage);
  await writeFile(join(generatedDirectory, 'TODO.mdx'), todoPage);
  await writeFile(join(generatedDirectory, 'build-configs.mdx'), buildFilesPage);
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
