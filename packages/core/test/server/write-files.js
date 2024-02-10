/* eslint-disable camelcase */

import {access} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';

it('writes files', async () => {
  const workspace = await createWorkspace();
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < 10; ++i) {
    const path = join(workspace, `${i}`);
    await writeFile(path, '');
    await access(path);
  }
});
