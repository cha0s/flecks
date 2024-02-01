import {processCode, spawnWith} from './process';

/* eslint-disable camelcase */
const {
  npm_config_user_agent = 'npm',
} = process.env;

export const inferPackageManager = () => npm_config_user_agent.split('/')[0];
/* eslint-enable camelcase */

export const build = async ({cwd, packageManager = inferPackageManager()}) => {
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

export const add = async ({dev, packageManager = inferPackageManager(), packages}) => {
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

export const install = async ({cwd, packageManager = inferPackageManager()}) => {
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

export const lockFile = (packageManager = inferPackageManager()) => {
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
