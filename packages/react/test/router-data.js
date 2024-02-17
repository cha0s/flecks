import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

it('implements data router', withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    const output = await page.waitForSelector('.test-contact');
    expect(await output?.evaluate((el) => el.textContent))
      .to.equal('2');
    await page.goto(new URL('/contact/2/edit', await page.url()));
    expect(await page.waitForSelector('#test-contact-form'))
      .to.not.be.undefined;
    await page.type('[name="id"]', '5');
    await page.click('[type="submit"]');
    const {pathname} = new URL(await page.url());
    expect(pathname)
      .to.equal('/contact/52');
  },
  {
    pagePath: '/contact/2',
    template: 'templates/router-custom',
  },
));

it('implements data router with ssr', withWeb(
  async ({page, response}) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.true;
    expect(await page.waitForSelector('#test-contact-form'))
      .to.not.be.undefined;
    await page.type('[name="id"]', '5');
    const navigation = page.waitForNavigation();
    await page.click('[type="submit"]');
    await navigation;
    const {pathname} = new URL(await page.url());
    expect(pathname)
      .to.equal('/contact/52');
  },
  {
    beforePage: async ({page}) => {
      await page.setJavaScriptEnabled(false);
    },
    pagePath: '/contact/2/edit',
    template: 'templates/router-custom',
  },
));
