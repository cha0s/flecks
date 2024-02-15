import {startServer} from '@flecks/server/test/helpers/start-server';

import {connectBrowser} from './connect-browser';

export function withWeb(task, options) {
  return async function withWeb() {
    const server = await startServer({...options, task: this});
    const socket = await server.waitForSocket({...options, task: this});
    if (options.beforeConnect) {
      await options.beforeConnect({server, socket});
    }
    const start = Date.now();
    const previousTimeout = this.timeout();
    this.timeout(0);
    const {payload: config} = await socket.send({type: 'config.get', payload: '@flecks/web'});
    this.timeout(previousTimeout + (Date.now() - start));
    const {browser, page, response} = await connectBrowser(
      // @todo schema
      `http://${config.public}`,
      {
        ...options,
        task: this,
      },
    );
    return task({
      browser,
      page,
      response,
      server,
      socket,
    });
  };
}
