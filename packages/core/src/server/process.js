const {exec, fork, spawn} = require('child_process');
const {
  access,
  constants: {X_OK},
  realpath,
} = require('fs/promises');
const {dirname, join, sep} = require('path');

const D = require('../../build/debug');

const debug = D('@flecks/core/server');
const debugSilly = debug.extend('silly');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.binaryPath = async (binary, root = FLECKS_CORE_ROOT) => {
  // eslint-disable-next-line no-eval
  const resolved = dirname(await realpath(eval('require').resolve(join(root, 'package.json'))));
  const parts = resolved.split(sep);
  while (parts.length > 0) {
    const path = parts.concat(join('node_modules', '.bin', binary)).join(sep);
    try {
      // eslint-disable-next-line no-await-in-loop
      await access(path, X_OK);
      return path;
    }
    catch (error) {
      parts.pop();
    }
  }
  throw new Error(`Binary '${binary}' not found! (root: ${root})`);
};

exports.processCode = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => {
    child.off('error', reject);
    resolve(code);
  });
});

exports.run = (cmd, {suppressError = true} = {}) => (
  new Promise((resolve) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        if (!suppressError) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        resolve(undefined);
        return;
      }
      resolve(stdout.trim());
    });
  })
);

const children = [];

exports.spawnWith = (cmd, opts = {}) => {
  const {useFork, ...rest} = opts;
  debug("%sing: '%s'", useFork ? 'fork' : 'spawn', cmd.join(' '));
  debugSilly('with options: %O', rest);
  const child = (useFork ? fork : spawn)(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    ...rest,
    env: {
      ...process.env,
      ...rest.env,
    },
  });
  children.push(child);
  child.on('exit', () => {
    children.splice(children.indexOf(child), 1);
  });
  return child;
};

let killed = false;

function handleTerminationEvent(signal) {
  // Clean up on exit.
  process.on(signal, () => {
    if (killed) {
      return;
    }
    killed = true;
    children.forEach((child) => {
      child.kill();
    });
    if ('exit' !== signal) {
      process.exit(1);
    }
  });
}

handleTerminationEvent('exit');
handleTerminationEvent('SIGINT');
handleTerminationEvent('SIGTERM');
