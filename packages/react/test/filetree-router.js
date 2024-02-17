import {expect} from 'chai';

import {createRoutesFromContext} from '@flecks/react/router';

it('does not nest siblings', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/siblings'));
  expect(routes)
    .to.deep.equal([{path: '/', name: 'index'}, {path: 'test', name: 'sibling'}]);
});

it('does nest siblings under parent', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/siblings-parent'));
  expect(routes)
    .to.deep.equal([
      {
        path: '/',
        name: 'index',
        children: [
          {path: ':test', name: 'test'},
          {path: ':test/nest', name: 'nest'},
        ],
      },
    ]);
});

it('does nest children', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/children'));
  expect(routes)
    .to.deep.equal([
      {
        path: '/',
        name: 'parent',
        children: [
          {path: 'test', name: 'child'},
        ],
      },
    ]);
});

it('finds dynamic segments', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/dynamic-segments'));
  expect(routes)
    .to.deep.equal([
      {
        path: '/',
        name: 'index',
        children: [
          {path: ':otherTest?', name: 'otherTest'},
          {path: ':test', name: 'test'},
        ],
      },
    ]);
});

it('finds splats', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/splats'));
  expect(routes)
    .to.deep.equal([
      {
        path: '/',
        name: 'index',
        children: [
          {path: '*', name: 'splat'},
        ],
      },
    ]);
});

it('allows colocated sources', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/colocated'));
  expect(routes)
    .to.deep.equal([{path: '/', name: 'index'}]);
});

it('promotes module with index export', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/index'));
  expect(routes)
    .to.deep.equal([
      {
        path: '/',
        name: 'index',
        children: [
          {index: true, name: 'test'},
        ],
      },
    ]);
});

it('hoists', async () => {
  const routes = await createRoutesFromContext(require.context('./filetree/hoist'));
  expect(routes)
    .to.deep.equal([
      {path: '/', name: 'index'},
      {path: '/test', name: 'test'},
    ]);
});
