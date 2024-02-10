import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {processCode, spawnWith} from '@flecks/core/server';
import {expect} from 'chai';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

it('generates a working application with npm', async () => {
  const workspace = await createWorkspace();
  const child = spawnWith(
    [join(FLECKS_CORE_ROOT, 'build', 'cli.js'), 'test-application'],
    {
      env: {FLECKS_CORE_ROOT: workspace},
      stdio: 'ignore',
    },
  );
  expect(await processCode(child))
    .to.equal(0);
  expect(await processCode(spawnWith(
    ['node', join(workspace, 'test-application', 'dist', 'server')],
    {stdio: 'ignore'},
  )))
    .to.equal(0);
});
