import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

it('implements react providers', withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    const output = await page.waitForSelector('.provider-test');
    expect(await output?.evaluate((el) => el.textContent))
      .to.equal('foobar');
  },
  {template: 'templates/provider'},
));
