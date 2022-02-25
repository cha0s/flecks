import {spawn} from 'child_process';
import {
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import {join, normalize} from 'path';

import {copySync, moveSync} from 'fs-extra';
import validate from 'validate-npm-package-name';

const {
  FLECKS_ROOT = process.cwd(),
} = process.env;

const cwd = normalize(FLECKS_ROOT);

const forwardProcessCode = (fn) => async (...args) => {
  process.exitCode = await fn(args.slice(0, -2));
};

const processCode = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => {
    child.off('error', reject);
    resolve(code);
  });
});

const monorepoScope = () => {
  try {
    statSync(join(cwd, 'packages'));
    const {name} = __non_webpack_require__(join(cwd, 'package.json'));
    const [scope] = name.split('/');
    return scope;
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    return undefined;
  }
};

const testDestination = (destination) => {
  try {
    statSync(destination);
    return false;
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    return true;
  }
};

const create = () => async () => {
  const rawname = process.argv[2];
  const {errors} = validate(rawname);
  if (errors) {
    // eslint-disable-next-line no-console
    console.error(`@flecks/create-fleck: invalid fleck name: ${errors.join(', ')}`);
    return 128;
  }
  const parts = rawname.split('/');
  let path = cwd;
  let pkg;
  let scope;
  if (1 === parts.length) {
    pkg = rawname;
  }
  else {
    [scope, pkg] = parts;
  }
  if (!scope) {
    scope = monorepoScope();
    if (scope) {
      path = join(path, 'packages');
    }
  }
  const name = [scope, pkg].filter((e) => !!e).join('/');
  const destination = join(path, pkg);
  if (!testDestination(destination)) {
    // eslint-disable-next-line no-console
    console.error(`@flecks/create-fleck: destination '${destination} already exists: aborting`);
    return 129;
  }
  // eslint-disable-next-line no-unreachable
  copySync(join(__dirname, 'template'), destination, {recursive: true});
  moveSync(join(destination, '.gitignore.extraneous'), join(destination, '.gitignore'));
  moveSync(join(destination, 'package.json.extraneous'), join(destination, 'package.json'));
  writeFileSync(
    join(destination, 'package.json'),
    JSON.stringify(
      {
        name,
        ...JSON.parse(readFileSync(join(destination, 'package.json')).toString()),
      },
      null,
      2,
    ),
  );
  const code = await processCode(spawn('yarn', [], {cwd: destination, stdio: 'inherit'}));
  if (0 !== code) {
    return code;
  }
  return processCode(spawn('yarn', ['build'], {cwd: destination, stdio: 'inherit'}));
};

forwardProcessCode(create())();
