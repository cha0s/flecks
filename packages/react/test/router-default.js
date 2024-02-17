import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

it('provides default routes', withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    const output = await page.waitForSelector('.flecks-router-root');
    expect(output)
      .to.not.be.undefined;
  },
  {
    template: 'templates/router-default',
  },
));

it('provides default routes with ssr', withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    const output = await page.waitForSelector('.flecks-router-root');
    expect(output)
      .to.not.be.undefined;
  },
  {
    beforePage: async ({page}) => {
      await page.setJavaScriptEnabled(false);
    },
    template: 'templates/router-default',
  },
));
