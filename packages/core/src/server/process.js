import {spawn} from 'child_process';

import D from '../../build/debug';

const debug = D('@flecks/core/server');
const debugSilly = debug.extend('silly');

export const processCode = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => {
    child.off('error', reject);
    resolve(code);
  });
});

export const spawnWith = (cmd, opts = {}) => {
  debug("spawning: '%s'", cmd.join(' '));
  debugSilly('with options: %O', opts);
  const child = spawn(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    ...opts,
    env: {
      ...process.env,
      ...opts.env,
    },
  });
  return child;
};