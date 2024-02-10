import {mkdir} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {pipesink, processCode, spawnWith} from '@flecks/core/server';
import {expect} from 'chai';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

it('fails if destination already exists', async () => {
  const workspace = await createWorkspace();
  await mkdir(join(workspace, 'failure'), {recursive: true});
  const child = spawnWith(
    [join(FLECKS_CORE_ROOT, 'build', 'cli.js'), 'failure'],
    {
      env: {FLECKS_CORE_ROOT: workspace},
      stdio: 'pipe',
    },
  );
  const buffer = await pipesink(child.stderr);
  expect(await processCode(child))
    .to.equal(1);
  expect(buffer.toString())
    .to.contain(`destination '${join(workspace, 'failure')}' already exists`);
});
