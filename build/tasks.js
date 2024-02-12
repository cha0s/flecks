const {join, relative} = require('path');

const {processCode, spawnWith} = require('@flecks/core/src/server');
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
      console.log(`::group::{${relative(FLECKS_CORE_ROOT, cwd)}}`);
      const code = await processCode(spawnWith(args, {cwd}));
      console.log(`::endgroup::{${relative(FLECKS_CORE_ROOT, cwd)}}`);
      return code;
    },
  );
})();
