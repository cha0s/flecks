import {mkdir} from 'fs/promises';
import {createServer} from 'net';
import {tmpdir} from 'os';
import {join} from 'path';
import {start} from 'repl';

import {D} from '@flecks/core';

const debug = D('@flecks/repl');
const debugSilly = debug.extend('silly');

export async function createReplServer(flecks) {
  const {id} = flecks.get('@flecks/core');
  const context = flecks.invokeFlat('@flecks/repl.context')
    .reduce((r, vars) => ({...r, ...vars}), {flecks});
  debug(
    'Object.keys(context) === %O',
    Object.keys(context),
  );
  const commands = {};
  Object.entries(
    flecks.invokeFlat('@flecks/repl.commands').reduce((r, commands) => ({...r, ...commands}), {}),
  ).forEach(([key, value]) => {
    commands[key] = value;
    debugSilly('registered command: %s', key);
  });
  const netServer = createServer((socket) => {
    debug('client connection to repl established');
    socket.on('close', () => {
      debug('client disconnected');
    });
    const replServer = start({
      prompt: `${id}> `,
      input: socket,
      output: socket,
    });
    replServer.on('exit', () => socket.end());
    Object.entries(context)
      .forEach(([key, value]) => {
        replServer.context[key] = value;
      });
    Object.entries(commands)
      .forEach(([key, value]) => {
        replServer.defineCommand(key, async (arg) => {
          const result = await value(arg);
          if (result) {
            socket.write(result, () => replServer.displayPrompt());
          }
          else {
            replServer.displayPrompt();
          }
        });
      });
  });
  try {
    await mkdir(join(tmpdir(), 'flecks', id, 'repl'), {recursive: true});
  }
  catch (error) {
    if ('EEXIST' !== error.code) {
      throw error;
    }
  }
  const socket = join(tmpdir(), 'flecks', id, 'repl', `${id}-${Date.now()}.sock`);
  flecks.repl = socket;
  await new Promise((resolve) => {
    netServer.listen(socket, resolve);
  });
  debug('listening @ %s', socket);
}

export function destroyReplServer(replServer) {
  if (!replServer) {
    return;
  }
  replServer.close();
}
