const {join} = require('path');

const {processCode, spawnWith} = require('@flecks/core/src/server');
const {glob} = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const {workspaces} = require(join(FLECKS_CORE_ROOT, 'package.json'));

(async () => {
  const paths = (
    await Promise.all(workspaces.map((workspace) => glob(join(FLECKS_CORE_ROOT, workspace))))
  )
    .flat();
  const cpus = new Array(require('os').cpus().length).fill(Promise.resolve(0));
  for (let i = 0; i < paths.length; ++i) {
    cpus[i % cpus.length] = cpus[i % cpus.length]
      .then(
        ((cwd) => (
          (code) => {
            if (0 === code) {
              return processCode(spawnWith(['npm', 'run', ...process.argv.slice(2)], {cwd}));
            }
          }
        ))(paths[i]),
      );
  }
  process.exitCode = (await Promise.all(cpus)).find((code) => code !== 0) || 0;
})();
