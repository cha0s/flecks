import {join} from 'path';

import {
  binaryPath,
  processCode,
  spawnWith,
} from '@flecks/core/server';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export async function build(path, {args = [], opts = {}} = {}) {
  return processCode(spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    {
      stdio: 'ignore',
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"preset": "none"}',
        FLECKS_ENV__flecks_server__start: 0,
        FLECKS_CORE_ROOT: path,
        NODE_ENV: 'test',
        NODE_PATH: join(FLECKS_CORE_ROOT, '..', '..', 'node_modules'),
        ...opts.env,
      },
    },
  ));
}
