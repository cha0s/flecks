import {Readable} from 'stream';

import {pipesink} from '@flecks/core/server';

export const hooks = {
  '@flecks/web/server.request.route': () => (req, res, next) => {
    req.body.request += '-value';
    next();
  },
  '@flecks/web/server.request.socket': () => (req, res, next) => {
    req.body.request = 'testing-value';
    next();
  },
  '@flecks/web/server.stream.html': async (stream, req) => {
    const html = (await pipesink(stream)).toString();
    return Readable.from(html.replace('<body>', `<body><p class="${req.body.request}">YEP</p>`));
  },
};
