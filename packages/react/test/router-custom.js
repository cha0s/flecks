import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

it('allows custom routes', 'undefined' !== typeof Headers && withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    const output = await page.waitForSelector('.custom-route');
    expect(output)
      .to.not.be.undefined;
  },
  {
    template: 'templates/router-custom',
  },
));
