import {processCode} from '@flecks/core/src/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('connects', withServer(
  async ({server}) => {
    const code = processCode(server.child);
    await server.actions([
      {type: 'exit', payload: 42},
    ]);
    expect(await code)
      .to.equal(42);
  },
  {failOnErrorCode: false},
));
