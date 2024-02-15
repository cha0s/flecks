import {startServer} from './start-server';

export function withServer(task, options) {
  return async function withServer() {
    const server = await startServer({...options, task: this});
    const socket = await server.waitForSocket({task: this});
    server.actions = async (actions) => {
      const results = [];
      await actions.reduce(
        (p, action) => (
          p.then(() => (
            socket.send(action)
              .then((result) => {
                results.push(result);
              })
          ))
        ),
        Promise.resolve(),
      );
      return results;
    };
    let taskError;
    try {
      await task({server, socket, task: this});
    }
    catch (error) {
      taskError = error;
    }
    server.child.done = true;
    server.child.kill();
    if (taskError) {
      throw taskError;
    }
  };
}
