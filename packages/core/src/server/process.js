const {exec, fork, spawn} = require('child_process');

const D = require('../../build/debug');

const debug = D('@flecks/core/server');
const debugSilly = debug.extend('silly');

exports.binaryPath = (binary) => (
  new Promise((resolve, reject) => {
    exec(`npx which ${binary}`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  })
);

exports.processCode = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => {
    child.off('error', reject);
    resolve(code);
  });
});

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
