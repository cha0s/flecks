import {writeFile} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {
  binaryPath,
  pipesink,
  processCode,
  spawnWith,
} from '@flecks/core/server';
import {expect} from 'chai';

it('fails predictably if no commands are defined', async () => {
  const workspace = await createWorkspace();
  await writeFile(join(workspace, 'package.json'), '{}');
  const child = spawnWith(
    [await binaryPath('flecks', '@flecks/build')],
    {
      stdio: 'pipe',
      env: {
        FLECKS_CORE_ROOT: workspace,
      },
    },
  );
  const buffer = await pipesink(child.stderr);
  expect(await processCode(child))
    .to.equal(1);
  expect(buffer.toString())
    .to.contain('No flecks commands defined');
});
