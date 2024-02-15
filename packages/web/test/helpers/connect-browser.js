import puppeteer from 'puppeteer';

export async function connectBrowser(url, options = {}) {
  let previousTimeout;
  const start = Date.now();
  if (options.task) {
    previousTimeout = options.task.timeout();
    options.task.timeout(0);
  }
  const {timeout = 30000} = options;
  const browser = await puppeteer.launch({
    // For CI.
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  let response;
  const handle = setTimeout(() => {
    throw new Error(`timed out trying to connect browser to '${url}'!`);
  }, timeout);
  /* eslint-disable no-await-in-loop */
  while (!response) {
    try {
      response = await page.goto(url, {...options, timeout: timeout - (Date.now() - start)});
      if (response) {
        break;
      }
    }
    catch {
      await new Promise((resolve) => {
        setTimeout(resolve, 250);
      });
    }
  }
  /* eslint-enable no-await-in-loop */
  clearTimeout(handle);
  options.task?.timeout(previousTimeout + (Date.now() - start));
  return {browser, page, response};
}
