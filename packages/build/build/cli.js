#!/usr/bin/env node

const D = require('@flecks/core/build/debug');
const {processCode} = require('@flecks/core/server');
const {Command} = require('commander');

const Build = require('./build');

const debug = D('@flecks/build/build/cli');
const debugSilly = debug.extend('silly');

// Asynchronous command process code forwarding.
const forwardProcessCode = (fn) => async (...args) => {
  const child = await fn(...args);
  if ('object' !== typeof child) {
    const code = 'undefined' !== typeof child ? child : 0;
    debugSilly('action returned code %d', code);
    process.exitCode = code;
    return;
  }
  try {
    const code = await processCode(child);
    debugSilly('action exited with code %d', code);
    process.exitCode = code;
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = child.exitCode || 1;
  }
};
// Initialize Commander.
const program = new Command();
program
  .enablePositionalOptions()
  .name('flecks')
  .usage('[command] [...]');
// Bootstrap.
(async () => {
  debugSilly('bootstrapping flecks...');
  const flecks = await Build.from();
  debugSilly('bootstrapped');
  // Register commands.
  const commands = flecks.invokeMerge('@flecks/build.commands', program);
  const keys = Object.keys(commands).sort();
  for (let i = 0; i < keys.length; ++i) {
    const {
      action,
      args = [],
      description,
      help,
      name = keys[i],
      options = [],
    } = commands[keys[i]];
    debugSilly('adding command %s...', name);
    const cmd = program.command(name);
    cmd.description(description);
    for (let i = 0; i < args.length; ++i) {
      cmd.addArgument(args[i]);
    }
    for (let i = 0; i < options.length; ++i) {
      cmd.addOption(options[i]);
    }
    cmd.action(forwardProcessCode(action));
    if (help) {
      cmd.addHelpText('after', `\n${help}`);
    }
  }
  // Parse commandline.
  program.parse(process.argv);
})();
