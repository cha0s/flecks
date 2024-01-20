const {processCode, spawnWith} = require('@flecks/core/build/commands');

module.exports = async (packageManager, cwd) => {
  const code = await processCode(spawnWith([packageManager, 'install'], {cwd}));
  if (0 !== code) {
    return code;
  }
  return processCode(spawnWith([packageManager, 'run', 'build'], {cwd}));
};
