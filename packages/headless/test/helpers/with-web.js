import {startServer} from '@flecks/server/test/helpers/start-server';

import {createBrowser, connectPage} from './connect';

export function withWeb(task, options) {
  return async function withWeb() {
    const optionsWithTask = {...options, task: this};
    const server = await startServer({
      ...optionsWithTask,
      opts: {
        ...optionsWithTask.opts,
        env: {
          FLECKS_ENV__flecks_web__port: '0',
          FLECKS_ENV__flecks_web__devPort: '0',
          ...optionsWithTask.opts?.env,
        },
      },
    });
    const socket = await server.waitForSocket(optionsWithTask);
    if (options.beforeConnect) {
      await options.beforeConnect({server, socket});
    }
    const start = Date.now();
    const previousTimeout = this.timeout();
    this.timeout(0);
    const {payload} = await socket.send({type: 'web.public'});
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
    const {pagePath = '/'} = options;
    const response = await connectPage(page, `http://${payload}${pagePath}`, optionsWithTask);
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
