import {join} from 'path';

import {expect} from 'chai';

import explicate from '@flecks/build/build/explicate';
import Resolver from '@flecks/build/build/resolver';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const root = join(FLECKS_CORE_ROOT, 'test', 'server', 'explicate');

function createExplication(paths, platforms) {
  const resolver = new Resolver({modules: [join(root, 'fake_node_modules')]});
  return explicate(
    paths,
    {
      platforms,
      resolver,
      root,
      importer: (request) => __non_webpack_require__(request),
    },
  );
}

describe('explication', () => {

  it('derives platforms', async () => {
    expect(Object.keys((await createExplication(['platformed'])).descriptors))
      .to.deep.equal([
        'platformed', 'platformed/server',
      ]);
    expect(Object.keys((await createExplication(['server-only'])).descriptors))
      .to.deep.equal([
        'server-only/server',
      ]);
  });

  it('derives through bootstrap', async () => {
    expect(Object.keys((await createExplication(['real-root'])).descriptors))
      .to.deep.equal([
        'dependency', 'dependency/server',
        'real-root', 'real-root/server',
      ]);
  });

  it('excludes platforms', async () => {
    expect(Object.keys(
      (await createExplication(
        ['platformed/client', 'dependency'],
        ['server', '!client'],
      )).descriptors,
    ))
      .to.deep.equal([
        'dependency', 'dependency/server',
      ]);
  });

  it('explicates parents first', async () => {
    expect(Object.keys((await createExplication(['real-root/server'])).descriptors))
      .to.deep.equal([
        'dependency', 'dependency/server',
        'real-root', 'real-root/server',
      ]);
  });

  it('explicates only bootstrapped', async () => {
    expect(Object.keys((await createExplication(['only-bootstrapped'])).descriptors))
      .to.deep.equal([
        'only-bootstrapped',
      ]);
  });

  it('skips nonexistent', async () => {
    expect(await createExplication(['real-root/nonexistent']))
      .to.deep.equal({descriptors: {}, roots: {}});
  });

});
