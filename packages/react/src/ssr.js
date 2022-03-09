import {Transform} from 'stream';

import React from 'react';
import ReactDOMServer from '@hot-loader/react-dom/server';

import root from './root';

class Ssr extends Transform {

  constructor(flecks, req) {
    super();
    this.flecks = flecks;
    this.req = req;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _transform(chunk, encoding, done) {
    const string = chunk
      .toString('utf8');
    if (-1 !== string.indexOf('<div id="root"></div>')) {
      const output = ReactDOMServer.renderToString(
        React.createElement(await root(this.flecks, this.req)),
      );
      this.push(
        string.replace(
          '<div id="root"></div>',
          `<div id="root">${output}</div>`,
        ),
      );
    }
    else {
      this.push(string);
    }
    done();
  }

}

export default (stream, req, flecks) => stream.pipe(new Ssr(flecks, req));
