import {join} from 'path';

import {pipesink, processCode, spawnWith} from '@flecks/core/server';
import {expect} from 'chai';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

it('shows help text', async () => {
  const child = spawnWith(
    [join(FLECKS_CORE_ROOT, 'build', 'cli.js'), '--help'],
    {stdio: 'pipe'},
  );
  const buffer = await pipesink(child.stdout);
  await processCode(child);
  expect(buffer.toString())
    .to.contain('display help for command');
});
