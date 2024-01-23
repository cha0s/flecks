import {expect} from 'chai';

import {
  parseFleckRoot,
  parseSource,
} from '@flecks/dox/build/parser';

import verifiedRoot from './verified-root';

it('parses build files', async () => {
  const source = `
    export const hooks = {
      '@flecks/build.files': () => ([
        /**
         * Description.
         */
        'filename',
      ]),
    }
  `;
  expect((await parseSource('', source)).buildFiles)
    .to.deep.equal([
      {description: 'Description.', filename: 'filename'},
    ]);
});

it('parses config', async () => {
  const source = `
    export const hooks = {
      '@flecks/core.config': () => ({
        /**
         * Hello
         */
        foo: 'bar',
      }),
    }
  `;
  expect((await parseSource('', source)).config)
    .to.deep.equal([
      {key: 'foo', description: 'Hello', defaultValue: "'bar'"},
    ]);
});

it('parses config', async () => {
  const source = `
    export const hooks = {
      '@flecks/core.config': () => ({
        /**
         * Hello
         */
        foo: 'bar',
      }),
    }
  `;
  expect((await parseSource('', source)).config)
    .to.deep.equal([
      {key: 'foo', description: 'Hello', defaultValue: "'bar'"},
    ]);
});

it('parses hook invocations based on context', async () => {
  const source = `
    flecks.invoke('foo');
    this.invokeFlat('bar');
  `;
  let hookInvocations;
  ({hookInvocations} = await parseSource('@flecks/core/build/flecks.js', source));
  expect(hookInvocations.length)
    .to.equal(2);
  ({hookInvocations} = await parseSource('nope', source));
  expect(hookInvocations.length)
    .to.equal(1);
});

it('parses todos', async () => {
  const source = `
    // @todo Do a thing.
    notAThing();
  `;
  expect((await parseSource('', source)).todos)
    .to.deep.equal([
      {description: 'Do a thing.', context: 'notAThing();'},
    ]);
});

it('parses a root', async () => {
  expect(await parseFleckRoot('root', './test/server/root'))
    .to.deep.equal(verifiedRoot);
});
