import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import explicate from '@flecks/build/build/explicate';
import Resolver from '@flecks/build/build/resolver';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const root = join(FLECKS_CORE_ROOT, 'test', 'server', 'explicate');

function createExplication(paths, platforms) {
  const resolver = new Resolver({
    modules: [join(root, 'fake_node_modules')],
    root,
  });
  return explicate({
    paths,
    platforms,
    resolver,
    importer: (request) => __non_webpack_require__(request),
  });
}

describe('explication', () => {

  it('derives platforms', async () => {
    expect(await createExplication(['platformed']))
      .to.deep.include({
        paths: ['platformed', 'platformed/server'],
      });
    expect(await createExplication(['server-only']))
      .to.deep.include({
        paths: ['server-only/server'],
      });
  });

  it('derives through bootstrap', async () => {
    expect(await createExplication(['real-root']))
      .to.deep.include({
        paths: [
          'dependency', 'dependency/server',
          'real-root', 'real-root/server',
        ],
      });
  });

  it('excludes platforms', async () => {
    expect(
      await createExplication(
        ['platformed/client', 'dependency'],
        ['server', '!client'],
      ),
    )
      .to.deep.include({
        paths: ['dependency', 'dependency/server'],
      });
  });

  it('explicates parents first', async () => {
    expect(await createExplication(['real-root/server']))
      .to.deep.include({
        paths: [
          'dependency', 'dependency/server',
          'real-root', 'real-root/server',
        ],
      });
  });

  it('explicates only bootstrapped', async () => {
    expect(await createExplication(['only-bootstrapped']))
      .to.deep.include({
        paths: ['only-bootstrapped'],
      });
  });

  it('explicates root with src', async () => {
    expect(await createExplication(['src-root:./src-root']))
      .to.deep.include({
        paths: ['src-root', 'src-root/server'],
      });
  });

  it('skips nonexistent', async () => {
    expect(await createExplication(['real-root/nonexistent']))
      .to.deep.equal({paths: [], roots: {}});
  });

  it('includes modules', async () => {
    // act doesn't like copying node_modules, so we'll spin it up.
    await mkdir(join(root, 'modules-root', 'node_modules'), {recursive: true});
    await writeFile(join(root, 'modules-root', 'node_modules', 'foo.js'), '');
    expect(await createExplication(['modules-root:./modules-root', 'foo']))
      .to.deep.include({
        paths: ['modules-root', 'foo'],
      });
  });

  it('explicates aliased platforms', async () => {
    expect(await createExplication(['aliased-platforms:./aliased-platforms']))
      .to.deep.include({
        paths: ['aliased-platforms', 'aliased-platforms/server'],
      });
  });

});
