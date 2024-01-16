const {readFile, writeFile} = require('fs/promises');
const {
  join,
  sep,
} = require('path');

const {dump: dumpYml, load: loadYml} = require('js-yaml');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (fleck, path) => {
  const key = [fleck].concat(path ? `.${sep}${join('packages', path, 'src')}` : []).join(':');
  const ymlPath = join(FLECKS_CORE_ROOT, 'build', 'flecks.yml');
  let yml = loadYml(await readFile(ymlPath));
  yml = Object.fromEntries(Object.entries(yml).concat([[key, {}]]));
  await writeFile(ymlPath, dumpYml(yml, {sortKeys: true}));
};
