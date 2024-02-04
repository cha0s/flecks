import {readFile, writeFile} from 'fs/promises';
import {load as loadYml} from 'js-yaml';
import addPathsToYml from '@flecks/build/build/add-paths-to-yml';
import {expect} from 'chai';

it('can add paths to YML', async () => {
  await writeFile(
    'test/server/yml/build/flecks.yml',
    `
      bar: {}
      foo: {}
    `,
  );
  await addPathsToYml(['a', 'two'], 'test/server/yml');
  expect(Object.keys(await loadYml(await readFile('test/server/yml/build/flecks.yml'))))
    .to.deep.equal(['a', 'bar', 'foo', 'two']);
});
