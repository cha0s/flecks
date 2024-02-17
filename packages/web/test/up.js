import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

let report;

it('brings a client up', withWeb(
  async ({
    page,
    response,
  }) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
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
  },
  {
    beforeConnect: ({socket}) => {
      report = socket.waitForAction('report');
    },
    template: 'templates/up',
  },
));
