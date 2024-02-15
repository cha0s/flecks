import {join} from 'path';

import Resolver from '@flecks/build/build/resolver';
import {createWorkspace} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

it('uses NODE_PATH when resolving', async () => {
  const workspace = await createWorkspace();
  await writeFile(join(workspace, 'nothing'), '');
  const {NODE_PATH} = process.env;
  process.env.NODE_PATH = workspace;
  const resolver = new Resolver();
  expect(await resolver.resolve('nothing'))
    .to.not.be.undefined;
  process.env.NODE_PATH = NODE_PATH;
});
