import {join} from 'path';

import {pipesink, processCode, spawnWith} from '@flecks/core/server';
import {expect} from 'chai';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

it('fails on invalid name', async () => {
  const child = spawnWith(
    [join(FLECKS_CORE_ROOT, 'build', 'cli.js'), "'R%@#'"],
    {stdio: 'pipe'},
  );
  const buffer = await pipesink(child.stderr);
  expect(await processCode(child))
    .to.equal(1);
  expect(buffer.toString())
    .to.contain('invalid app name');
});
