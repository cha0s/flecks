const {
  access,
  cp,
  mkdir,
  rename,
  rmdir,
} = require('fs/promises');
const {dirname, join} = require('path');

const {
  generate,
  resolveSiteDir,
  spawn,
} = require('./docusaurus');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = (program, flecks) => {
  const commands = {};
  const siteDirArgument = program.createArgument('[siteDir]', 'Docusaurus directory');
  siteDirArgument.defaultValue = 'website';
  commands.docusaurus = {
    description: 'create a documentation website for this project',
    action: async (subcommand, siteDir) => {
      const resolvedSiteDir = resolveSiteDir(siteDir);
      let siteDirExisted = false;
      try {
        const result = await mkdir(resolvedSiteDir);
        if (undefined === result) {
          await rmdir(resolvedSiteDir);
        }
      }
      catch (error) {
        siteDirExisted = true;
      }
      switch (subcommand) {
        case 'build':
          if (!siteDirExisted) {
            throw new Error(`There's no website directory at ${resolvedSiteDir} to build!`);
          }
          await generate(flecks, resolvedSiteDir);
          spawn('build', resolvedSiteDir);
          break;
        case 'create': {
          if (siteDirExisted) {
            throw new Error(`A website directory at ${resolvedSiteDir} already exists!`);
          }
          const templateDirectory = dirname(require.resolve('@flecks/dox/website/sidebars.js'));
          await cp(templateDirectory, resolvedSiteDir, {recursive: true});
          // Copy the docusaurus config if it doesn't already exist.
          try {
            await access(join(FLECKS_CORE_ROOT, 'build', 'docusaurus.config.js'));
          }
          catch (error) {
            await rename(
              join(resolvedSiteDir, 'docusaurus.config.js'),
              join(FLECKS_CORE_ROOT, 'build', 'docusaurus.config.js'),
            );
          }
          // eslint-disable-next-line no-console
          console.error(`website directory created at ${resolvedSiteDir}!`);
          break;
        }
        case 'start':
          if (!siteDirExisted) {
            throw new Error(`There's no website directory at ${resolvedSiteDir} to start!`);
          }
          await generate(flecks, resolvedSiteDir);
          spawn('start', resolvedSiteDir);
          break;
        default:
          break;
      }
    },
    args: [
      program.createArgument('subcommand', 'Docusaurus command to run')
        .choices(['build', 'create', 'start']),
      siteDirArgument,
    ],
    help: [
      'The `build` and `start` subcommands are sugar on top of the corresponding Docusaurus commands.',
      '',
      'The `create` subcommand will create a documentation website starter template for you at `siteDir`',
      "if `siteDir` doesn't already exist (defaults to `website`). A `docusaurus.config.js`",
      "starter configuration will also be copied to your `build` directory if it doesn't already exist.",
    ].join('\n'),
  };
  return commands;
};
