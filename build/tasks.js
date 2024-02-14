const {join, relative} = require('path');
const {PassThrough} = require('stream');

const {pipesink, processCode, spawnWith} = require('@flecks/core/src/server');
const chalk = require('chalk');
const {glob} = require('glob');

const concurrent = require('./concurrent');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const args = process.argv.slice(2);
const {workspaces} = require(join(FLECKS_CORE_ROOT, 'package.json'));

(async () => {
  process.exitCode = await concurrent(
    (await Promise.all(workspaces.map((path) => glob(join(FLECKS_CORE_ROOT, path))))).flat(),
    async (cwd) => {
      const child = spawnWith(
        args,
        {
          cwd,
          stdio: 'pipe',
        },
      );
      const stdio = new PassThrough();
      const buffer = pipesink(child.stderr.pipe(child.stdout.pipe(stdio)));
      const code = await processCode(child);
      console.log(
        `::group::@flecks/${
          chalk.blue(relative(join(FLECKS_CORE_ROOT, 'packages'), cwd))
        } ${0 === code ? chalk.green('passed') : chalk.red('failed')}`,
      );
      process.stdout.write(await buffer);
      console.log('::endgroup::\n');
      return code;
    },
  );
  console.log(0 === process.exitCode ? chalk.green('success') : chalk.red('failure'), '\n');
})();
