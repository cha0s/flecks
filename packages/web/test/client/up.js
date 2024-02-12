import {expect} from 'chai';

import {withWeb} from '../helpers/with-web';

let report;

const options = {
  beforeConnect: ({socket}) => {
    report = socket.waitForAction('report');
  },
};

it('brings a client up', withWeb(
  async function test({
    browser,
    page,
    response,
  }) {
    expect(response)
      .to.not.be.null;
    const {
      payload: {
        config,
        id,
        request,
      },
    } = await report;
    const appMountSelector = await page.waitForSelector(`#${id}`);
    expect(await appMountSelector?.evaluate((el) => el.textContent))
      .to.equal('hello world');
    const yepSelector = await page.waitForSelector(`.${request}`);
    expect(await yepSelector?.evaluate((el) => el.textContent))
      .to.equal('YEP');
    expect(config)
      .to.deep.equal({why: 'hello there'});
    expect(request)
      .to.equal('testing-value-value');
    await browser.close();
  },
  options,
));
