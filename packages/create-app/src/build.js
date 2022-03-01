import {processCode, spawnWith} from '@flecks/core/server';

export default async (cwd) => {
  const code = await processCode(spawnWith(['yarn'], {cwd}));
  if (0 !== code) {
    return code;
  }
  return processCode(spawnWith(['yarn', 'build'], {cwd}));
};
