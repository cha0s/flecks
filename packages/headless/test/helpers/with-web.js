import {startServer} from '@flecks/server/test/helpers/start-server';

import {createBrowser, connectPage} from './connect';

export function withWeb(task, options) {
  return async function withWeb() {
    const optionsWithTask = {...options, task: this};
    const server = await startServer(optionsWithTask);
    const socket = await server.waitForSocket(optionsWithTask);
    if (options.beforeConnect) {
      await options.beforeConnect({server, socket});
    }
    const start = Date.now();
    const previousTimeout = this.timeout();
    this.timeout(0);
    const {payload: config} = await socket.send({type: 'config.get', payload: '@flecks/web'});
    this.timeout(previousTimeout + (Date.now() - start));
    const {browser, page} = await createBrowser(optionsWithTask);
    if (options.beforePage) {
      await options.beforePage({
        browser,
        page,
        server,
        socket,
      });
    }
    const response = await connectPage(page, `http://${config.public}`, optionsWithTask);
    let taskError;
    try {
      await task({
        browser,
        page,
        response,
        server,
        socket,
        task: this,
      });
    }
    catch (error) {
      taskError = error;
    }
    await browser.close();
    if (taskError) {
      throw taskError;
    }
  };
}
