import addPathsToYml from '@flecks/core/build/add-paths-to-yml';
import {loadYml, writeFile} from '@flecks/core/server';
import {expect} from 'chai';
import {readFile} from 'fs/promises';

it('can add paths to YML', async () => {
  await writeFile(
    'test/yml/build/flecks.yml',
    `
      bar: {}
      foo: {}
    `,
  );
  await addPathsToYml(['a', 'two'], 'test/yml');
  expect(Object.keys(await loadYml(await readFile('test/yml/build/flecks.yml'))))
    .to.deep.equal(['a', 'bar', 'foo', 'two']);
});
