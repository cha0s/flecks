const {spawn} = require('child_process');
const {readdir} = require('fs/promises');
const {tmpdir} = require('os');
const {join} = require('path');

const {D} = require('@flecks/core');
const commandExists = require('command-exists');

const debug = D('@flecks/repl/commands');

module.exports = (program, flecks) => {
  const commands = {};
  commands.repl = {
    options: [
      program.createOption('-r, --rlwrap', 'use rlwrap around socat'),
    ],
    description: 'Connect to REPL.',
    action: async (opts) => {
      const {
        rlwrap,
      } = opts;
      try {
        await commandExists('socat');
      }
      catch (error) {
        throw new Error('socat must be installed to use REPL');
      }
      if (rlwrap) {
        try {
          await commandExists('rlwrap');
        }
        catch (error) {
          throw new Error('rlwrap must be installed to use --rlwrap');
        }
      }
      const {id} = flecks.get('@flecks/core');
      const directory = join(tmpdir(), 'flecks', id, 'repl');
      const filenames = await readdir(directory);
      const sockets = filenames.filter(
        // eslint-disable-next-line no-useless-escape
        (filename) => filename.match(new RegExp(`${id}-.*\.sock$`)),
      );
      const socket = join(
        directory,
        sockets
          .sort((l, r) => (l > r ? -1 : 1))
          .shift(),
      );
      const spawnOptions = {
        stdio: 'inherit',
      };
      const [cmd, args] = (
        rlwrap
          ? ['rlwrap', ['-C', 'qmp', 'socat', 'STDIO', `UNIX:${socket}`]]
          : ['socat', ['-', `unix-client:${socket}`]]
      );
      debug('spawning:\n%s %s', cmd, args.join(' '));
      return spawn(cmd, args, spawnOptions);
    },
  };
  return commands;
};
