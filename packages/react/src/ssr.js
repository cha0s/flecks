import {Transform} from 'stream';

import {D} from '@flecks/core';
import React from 'react';
import ReactDOMServer from '@hot-loader/react-dom/server';

import root from './root';

const debug = D('@flecks/react/root');

class Ssr extends Transform {

  constructor(flecks, req) {
    super();
    this.flecks = flecks;
    this.req = req;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _transform(chunk, encoding, done) {
    const string = chunk.toString('utf8');
    const {appMountId} = this.flecks.get('@flecks/web/server');
    if (-1 !== string.indexOf(`<div id="${appMountId}"></div>`)) {
      try {
        const renderedRoot = ReactDOMServer.renderToString(
          React.createElement(await root(this.flecks, this.req)),
        );
        const rendered = string.replaceAll(
          `<div id="${appMountId}"></div>`,
          `<div id="${appMountId}">${renderedRoot}</div>`,
        );
        this.push(rendered);
      }
      catch (error) {
        debug('React SSR failed: %O', error);
        this.push(string);
      }
    }
    else {
      this.push(string);
    }
    done();
  }

}

export default (stream, req, flecks) => stream.pipe(new Ssr(flecks, req));
