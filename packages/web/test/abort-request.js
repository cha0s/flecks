import {expect} from 'chai';

import {withWeb} from '@flecks/headless/test/helpers/with-web';

it('allows request aborting', withWeb(
  async ({
    response,
  }) => {
    expect(response)
      .to.not.be.null;
    expect(response.ok())
      .to.be.false;
  },
  {
    template: 'templates/abort-request',
  },
));
