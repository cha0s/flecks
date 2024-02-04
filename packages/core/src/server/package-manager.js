const {processCode, spawnWith} = require('./process');

/* eslint-disable camelcase */
const {
  npm_config_user_agent = 'npm',
} = process.env;

exports.inferPackageManager = () => npm_config_user_agent.split('/')[0];
/* eslint-enable camelcase */

exports.build = async ({cwd, packageManager = exports.inferPackageManager()}) => {
  let args;
  switch (packageManager) {
    case 'bun':
      args = ['bun', 'run', 'build'];
      break;
    case 'npm':
      args = ['npm', 'run', 'build'];
      break;
    case 'pnpm':
      args = ['pnpm', 'run', 'build'];
      break;
    case 'yarn':
      args = ['yarn', 'run', 'build'];
      break;
    default:
  }
  return args && processCode(spawnWith(args, {cwd}));
};

exports.add = async ({dev, packageManager = exports.inferPackageManager(), packages}) => {
  let args;
  switch (packageManager) {
    case 'bun':
      args = [
        'bun', 'add',
        ...(dev ? ['--dev'] : []),
        ...packages,
      ];
      break;
    case 'npm':
      args = [
        'npm', 'install',
        ...(dev ? ['--save-dev'] : []),
        ...packages,
      ];
      break;
    case 'pnpm':
      args = [
        'pnpm', 'add',
        ...(dev ? ['--save-dev'] : []),
        ...packages,
      ];
      break;
    case 'yarn':
      args = [
        'yarn', 'add',
        ...(dev ? ['--dev'] : []),
        ...packages,
      ];
      break;
    default:
  }
  return args && processCode(spawnWith(args));
};

exports.install = async ({cwd, packageManager = exports.inferPackageManager()}) => {
  let args;
  switch (packageManager) {
    case 'bun':
      args = ['bun', 'install'];
      break;
    case 'npm':
      args = ['npm', 'install'];
      break;
    case 'pnpm':
      args = ['pnpm', 'install'];
      break;
    case 'yarn':
      args = ['yarn', 'install'];
      break;
    default:
  }
  return args && processCode(spawnWith(args, {cwd}));
};

exports.lockFile = (packageManager = exports.inferPackageManager()) => {
  switch (packageManager) {
    case 'bun':
      return 'bun.lockb';
    case 'npm':
      return 'package-lock.json';
    case 'pnpm':
      return 'pnpm-lock.yaml';
    case 'yarn':
      return 'yarn.lock';
    default:
      return '';
  }
};
