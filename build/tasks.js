const {join} = require('path');

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
    (cwd) => processCode(spawnWith(args, {cwd})),
  );
})();
