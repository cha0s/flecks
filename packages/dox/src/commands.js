import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';

import {D} from '@flecks/core';

import {
  generateBuildConfigsPage,
  generateHookPage,
  generateTodoPage,
} from './generate';
import {parseFlecks} from './parser';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/dox/commands');

export default (program, flecks) => {
  const commands = {};
  commands.dox = {
    description: 'generate documentation for this project',
    action: async () => {
      debug('Parsing flecks...');
      const state = await parseFlecks(flecks);
      debug('parsed');
      debug('Generating hooks page...');
      const hookPage = generateHookPage(state.hooks, flecks);
      debug('generated');
      debug('Generating TODO page...');
      const todoPage = generateTodoPage(state.todos, flecks);
      debug('generated');
      debug('Generating build configs page...');
      const buildConfigsPage = generateBuildConfigsPage(state.buildConfigs);
      debug('generated');
      const output = join(FLECKS_CORE_ROOT, 'dox');
      await mkdir(output, {recursive: true});
      /* eslint-disable no-console */
      console.log('');
      console.group('Output:');
      debug('Writing hooks page...');
      await writeFile(join(output, 'hooks.md'), hookPage);
      console.log('hooks.md');
      debug('Writing TODO page...');
      await writeFile(join(output, 'TODO.md'), todoPage);
      console.log('TODO.md');
      debug('Writing build configs page...');
      await writeFile(join(output, 'build-configs.md'), buildConfigsPage);
      console.log('build-configs.md');
      console.groupEnd();
      console.log('');
      /* eslint-enable no-console */
    },
  };
  return commands;
};
