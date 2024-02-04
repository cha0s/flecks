const {join} = require('path');

const {processCode, spawnWith} = require('@flecks/core/src/server');
const {glob} = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const args = ['npm', 'run', ...process.argv.slice(2)];
const {workspaces} = require(join(FLECKS_CORE_ROOT, 'package.json'));

(async () => {
  const paths = (await Promise.all(workspaces.map((path) => glob(join(FLECKS_CORE_ROOT, path)))))
    .flat();
  const cpus = new Array(require('os').cpus().length).fill(Promise.resolve(0));
  for (let i = 0; i < paths.length; ++i) {
    // then= :)
    cpus[i % cpus.length] = cpus[i % cpus.length]
      .then(((cwd) => async (code) => (
        (await processCode(spawnWith(args, {cwd}))) || code
      ))(paths[i]));
  }
  process.exitCode = (await Promise.all(cpus)).find((code) => code !== 0) || 0;
})();
