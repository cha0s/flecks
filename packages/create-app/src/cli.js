import {spawn} from 'child_process';
import {readFileSync, writeFileSync} from 'fs';
import {join, normalize} from 'path';

import {
  copySync,
  mkdirpSync,
  moveSync,
} from 'fs-extra';

const cwd = normalize(process.cwd());

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

const create = () => async () => {
  const name = process.argv[2];
  const path = name.split('/').pop();
  copySync(join(__dirname, 'template'), join(cwd, path), {recursive: true});
  mkdirpSync(join(cwd, path, 'packages'));
  moveSync(join(cwd, path, '.gitignore.extraneous'), join(cwd, path, '.gitignore'));
  moveSync(join(cwd, path, 'package.json.extraneous'), join(cwd, path, 'package.json'));
  writeFileSync(
    join(cwd, path, 'package.json'),
    JSON.stringify(
      {
        name: `@${name}/monorepo`,
        ...JSON.parse(readFileSync(join(cwd, path, 'package.json')).toString()),
      },
      null,
      2,
    ),
  );
  const code = await processCode(spawn('yarn', [], {cwd: join(cwd, path), stdio: 'inherit'}));
  if (0 !== code) {
    return code;
  }
  return processCode(spawn('yarn', ['build'], {cwd: join(cwd, path), stdio: 'inherit'}));
};

forwardProcessCode(create())();
