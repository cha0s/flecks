const {join} = require('path');

const {processCode, spawnWith} = require('@flecks/core/src/server');
const {glob} = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const args = ['npm', 'publish', '--provenance'];
const {workspaces} = require(join(FLECKS_CORE_ROOT, 'package.json'));

(async () => {
  const paths = (await Promise.all(workspaces.map((path) => glob(join(FLECKS_CORE_ROOT, path)))))
    .flat();
  const cpus = new Array(require('os').cpus().length).fill(Promise.resolve(0));
  paths.forEach((cwd, i) => {
    // then= :)
    cpus[i % cpus.length] = cpus[i % cpus.length]
      .then(async (code) => (
        (await processCode(spawnWith(args, {cwd: join(cwd, 'dist', 'fleck')}))) || code
      ));
  });
  process.exitCode = (await Promise.all(cpus)).find((code) => code !== 0) || 0;
})();
