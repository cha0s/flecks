const {Buffer} = require('buffer');
const {exec} = require('child_process');
const {createHash} = require('crypto');
const {createReadStream} = require('fs');
const {cp, mkdir, writeFile} = require('fs/promises');
const {join} = require('path');

const {
  processCode,
  spawnWith,
} = require('@flecks/core/src/server');
const Arborist = require('@npmcli/arborist');
const {glob} = require('glob');

const concurrent = require('./concurrent');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const args = ['npm', 'publish', ...process.argv.slice(2)];
const bumpedVersions = {};
const creators = ['create-app', 'create-fleck'];
const localVersions = {};
const packCache = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'publish');
const {workspaces} = require(join(FLECKS_CORE_ROOT, 'package.json'));

const run = (cmd) => (
  new Promise((resolve) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        resolve(undefined)
        return;
      }
      resolve(stdout.trim());
    });
  })
);

// Get integrity sums for creator dependencies.
const packPkg = async (pkg) => {
  await processCode(spawnWith(
    ['npm', 'pack', '--pack-destination', packCache],
    {cwd: join(FLECKS_CORE_ROOT, 'packages', pkg, 'dist', 'fleck'), stdio: 'ignore'},
  ));
};

const bumpDependencies = (dependencies) => (
  Object.fromEntries(
    Object.entries(dependencies)
      .map(([pkg, version]) => ([pkg, localVersions[pkg] || version])),
  )
);

const integrityForPkg = async (pkg) => {
  const pack = join(packCache, `flecks-${pkg.split('/')[1]}-${localVersions[pkg]}.tgz`);
  const buffers = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const data of createReadStream(pack).pipe(createHash('sha512'))) {
    buffers.push(data);
  }
  return `sha512-${Buffer.concat(buffers).toString('base64')}`;
};

const shrinkwrap = async (path) => {
  const arb = new Arborist({
    path,
    registry: await run('npm config get registry'),
  });
  const {meta} = await arb.buildIdealTree({saveType: 'prod'});
  const shrinkwrap = await meta.commit();
  shrinkwrap.packages = Object.fromEntries(
    await Promise.all(
      Object.entries(shrinkwrap.packages)
        .map(async ([pkg, config]) => {
          if (pkg.match(/node_modules\/@flecks\/[^/]+$/)) {
            if (config.dependencies) {
              config.dependencies = bumpDependencies(config.dependencies);
            }
            if (config.devDependencies) {
              config.devDependencies = bumpDependencies(config.devDependencies);
            }
            const subpkg = pkg.split('/').slice(1).join('/');
            config.version = localVersions[subpkg];
            config.integrity = await integrityForPkg(subpkg);
          }
          return [pkg, config];
        }),
    ),
  );
  return shrinkwrap;
};

const shrinkwrapsAndPublish = async (creator) => {
  const dist = join(FLECKS_CORE_ROOT, 'packages', creator, 'dist', 'fleck');
  const fakePackage = join(packCache, creator);
  await mkdir(fakePackage, {recursive: true});
  // Get a shrinkwrap from template package.json and insert it as a package-lock.json.
  await cp(join(dist, 'template', 'package.json.noconflict'), join(fakePackage, 'package.json'));
  await writeFile(
    join(dist, 'template', 'package-lock.json.noconflict'),
    JSON.stringify(await shrinkwrap(fakePackage), null, 2),
  );
  // Get a shrinkwrap from the built creator and insert it as shrinkwrap.
  await writeFile(
    join(dist, 'npm-shrinkwrap.json'),
    JSON.stringify(await shrinkwrap(dist), null, 2),
  );
  // Publish.
  await processCode(spawnWith(args, {cwd: dist}));
};

// npm can be slow...
const waitForPkgToPublish = (pkg) => (
  new Promise(async (resolve) => {
    if (await run(`npm view ${pkg}@${localVersions[pkg]}`)) {
      resolve();
    }
    const handle = setInterval(async () => {
      if (await run(`npm view ${pkg}@${localVersions[pkg]}`)) {
        clearInterval(handle);
        resolve();
      }
    }, 5000);
  })
);

(async () => {
  await concurrent(
    (await Promise.all(workspaces.map((path) => glob(join(FLECKS_CORE_ROOT, path))))).flat(),
    async (cwd) => {
      const {name, version} = require(join(cwd, 'package.json'));
      const [localVersion, remoteVersion] = await Promise.all([
        version,
        run(`npm view ${name} version`),
      ]);
      localVersions[name] = version;
      if (localVersion === remoteVersion) {
        return undefined;
      }
      bumpedVersions[name] = version;
      // Skip creators for now.
      if (creators.some((creator) => name.endsWith(creator))) {
        return undefined;
      }
      return processCode(spawnWith(args, {cwd: join(cwd, 'dist', 'fleck')}));
    },
  );
  // No creators? Bail.
  if (!bumpedVersions['@flecks/create-app'] && !bumpedVersions['@flecks/create-fleck']) {
    return;
  }
  // Pack dependencies.
  await mkdir(packCache, {recursive: true});
  const dependencies = ['build', 'core', 'fleck', 'server'];
  await Promise.all(dependencies.map((pkg) => waitForPkgToPublish(`@flecks/${pkg}`)));
  await Promise.all(dependencies.map(packPkg));
  if (bumpedVersions['@flecks/create-fleck']) {
    await shrinkwrapsAndPublish('create-fleck');
  }
  if (bumpedVersions['@flecks/create-app']) {
    // Needs packed create-fleck for package lock.
    await packPkg('create-fleck');
    await waitForPkgToPublish('@flecks/create-fleck');
    await shrinkwrapsAndPublish('create-app');
  }
})();
