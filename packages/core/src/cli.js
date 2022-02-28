import {fork} from 'child_process';
import {join, resolve, sep} from 'path';

import {Command} from 'commander';

import D from './debug';
import Flecks from './server/flecks';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/cli');

// Guarantee local node_modules path.
const defaultNodeModules = resolve(join(FLECKS_CORE_ROOT, 'node_modules'));
const nodePathSeparator = '/' === sep ? ':' : ';';
let updatedNodePath;
if (!process.env.NODE_PATH) {
  updatedNodePath = defaultNodeModules;
}
else {
  const parts = process.env.NODE_PATH.split(nodePathSeparator);
  if (!parts.some((part) => resolve(part) === defaultNodeModules)) {
    parts.push(defaultNodeModules);
    updatedNodePath = parts.join(nodePathSeparator);
  }
}
// Guarantee symlink preservation for linked flecks.
const updateSymlinkPreservation = !process.env.NODE_PRESERVE_SYMLINKS;

const environmentUpdates = (
  updatedNodePath
  || updateSymlinkPreservation
)
  ? {
    NODE_PATH: updatedNodePath,
    NODE_PRESERVE_SYMLINKS: 1,
  }
  : undefined;
if (environmentUpdates) {
  debug('updating environment, forking with %O...', environmentUpdates);
  const forkOptions = {
    env: {
      ...process.env,
      ...environmentUpdates,
      DEBUG_COLORS: 'true',
    },
    stdio: 'inherit',
  };
  fork(__filename, process.argv.slice(2), forkOptions)
    .on('exit', (code, signal) => {
      process.exitCode = code;
      process.exit(signal);
    });
}
else {
  // Asynchronous command process code forwarding.
  const forwardProcessCode = (fn) => async (...args) => {
    const child = await fn(...args);
    if ('object' !== typeof child) {
      debug('action returned code %d', child);
      process.exitCode = child;
      return;
    }
    const reject = (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exitCode = child.exitCode || 1;
    };
    child.on('error', reject);
    child.on('exit', (code) => {
      child.off('error', reject);
      debug('action exited with code %d', code);
      process.exitCode = code;
    });
  };
  // Initialize Commander.
  const program = new Command();
  program.enablePositionalOptions();
  // Bootstrap.
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');
  // Register commands.
  const commands = flecks.invokeReduce('@flecks/core/commands', undefined, undefined, program);
  const keys = Object.keys(commands);
  for (let i = 0; i < keys.length; ++i) {
    const {
      action,
      args = [],
      description,
      name = keys[i],
      options = [],
    } = commands[keys[i]];
    debug('adding command %s...', name);
    const cmd = program.command(name);
    cmd.description(description);
    for (let i = 0; i < args.length; ++i) {
      cmd.addArgument(args[i]);
    }
    for (let i = 0; i < options.length; ++i) {
      cmd.option(...options[i]);
    }
    cmd.action(forwardProcessCode(action));
  }
  // Parse commandline.
  program.parse(process.argv);
}
