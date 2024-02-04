import {processCode, spawnWith} from '@flecks/core/server';
import {expect} from 'chai';

it('can lint', async () => {
  expect(
    await processCode(await spawnWith(
      ['npx', 'eslint', '--config', 'build/eslint.config.js', 'test/server/lint/fine.js'],
      {
        env: {
          FLECKS_BUILD_ESLINT_NO_CACHE: true,
          FLECKS_BUILD_TESTING_LINT: true,
        },
      },
    )),
  )
    .to.equal(0);
});

it('can fail to lint', async () => {
  expect(
    await processCode(await spawnWith(
      ['npx', 'eslint', '--config', 'build/eslint.config.js', 'test/server/lint/fail.js'],
      {
        env: {
          FLECKS_BUILD_ESLINT_NO_CACHE: true,
          FLECKS_BUILD_TESTING_LINT: true,
        },
        stdio: 'ignore',
      },
    )),
  )
    .to.not.equal(0);
});

it('can override lint', async () => {
  expect(
    await processCode(await spawnWith(
      ['npx', 'eslint', '--config', 'build/eslint.config.js', 'test/server/lint/fine.js'],
      {
        env: {
          FLECKS_BUILD_ESLINT_NO_CACHE: true,
          FLECKS_BUILD_TESTING_LINT: true,
          FLECKS_CORE_ROOT: 'test/server/lint/root',
        },
        stdio: 'ignore',
      },
    )),
  )
    .to.not.equal(0);
});
