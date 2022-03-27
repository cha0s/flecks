import {expect} from 'chai';

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import {Flecks} from '../../../src/server';

it('bootstraps FLECKS_CORE_ROOT by default', () => {
  const flecks = Flecks.bootstrap();
  expect(flecks.fleck('@flecks/core')).to.not.equal(undefined);
});

it('bootstraps server platform by default', () => {
  const flecks = Flecks.bootstrap();
  expect(flecks.fleck('@flecks/core/server')).to.not.equal(undefined);
});

it('can bootstrap from a foreign root', () => {
  const flecks = Flecks.bootstrap({
    root: './test',
  });
  expect(flecks.fleck('@flecks/core/one')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/two')).to.not.equal(undefined);
});

it('can bootstrap other platforms', () => {
  const flecks = Flecks.bootstrap({
    platforms: ['client'],
    root: './test',
  });
  expect(flecks.fleck('@flecks/core/one')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/one/client')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/one/server')).to.not.equal(undefined);
});

it('can exclude platforms', () => {
  const flecks = Flecks.bootstrap({
    platforms: ['client', '!server'],
    root: './test',
  });
  expect(flecks.fleck('@flecks/core/one')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/one/client')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/one/server')).to.equal(undefined);
});

it('provides webpack goodies in nodespace', () => {
  const flecks = Flecks.bootstrap({
    root: './test',
  });
  flecks.fleck('@flecks/core/one').testNodespace().forEach((result) => {
    expect(result).to.not.equal('undefined');
  });
});
