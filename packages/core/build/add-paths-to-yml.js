const {readFile} = require('fs/promises');
const {join} = require('path');

const {dump: dumpYml, load: loadYml} = require('js-yaml');

const {writeFile} = require('../src/server/fs');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (paths, root) => {
  const ymlPath = join(root || FLECKS_CORE_ROOT, 'build', 'flecks.yml');
  let yml = loadYml(await readFile(ymlPath)) || {};
  yml = Object.fromEntries(Object.entries(yml).concat(paths.map((path) => [path, {}])));
  await writeFile(ymlPath, dumpYml(yml, {sortKeys: true}));
};
