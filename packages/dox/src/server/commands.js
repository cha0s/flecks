import {
  access,
  cp,
  mkdir,
  rename,
  rmdir,
} from 'fs/promises';
import {dirname, join} from 'path';

import {
  generate,
  resolveSiteDir,
  spawn,
} from './docusaurus';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export default (program, flecks) => {
  const {Argument} = flecks.fleck('@flecks/core/server');
  const commands = {};
  const siteDirArgument = new Argument('[siteDir]', 'Docusaurus directory', 'website');
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
          const templateDirectory = dirname(
            __non_webpack_require__.resolve('@flecks/dox/website/sidebars.js'),
          );
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
      new Argument('subcommand', 'Docusaurus command to run').choices(['build', 'create', 'start']),
      siteDirArgument,
    ],
  };
  return commands;
};
