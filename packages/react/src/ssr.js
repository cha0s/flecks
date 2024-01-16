import {Readable} from 'stream';

import {WritableStream} from 'htmlparser2/lib/WritableStream';
import React from 'react';
import {renderToPipeableStream} from 'react-dom/server';

import {configSource} from '@flecks/web/server';
import Document from './document';
import root from './root';

export default async (stream, req, flecks) => {
  const {
    appMountId,
    base,
    icon,
    meta,
    title,
  } = flecks.get('@flecks/web');
  // Extract assets.
  const css = [];
  let hasVendor = false;
  let inline = '';
  let isInScript = 0;
  let isSkipping = false;
  const js = [];
  const parserStream = new WritableStream({
    onclosetag(tagName) {
      if ('script' === tagName) {
        isInScript -= 1;
        isSkipping = false;
      }
    },
    onopentag(tagName, attribs) {
      if ('script' === tagName) {
        isInScript += 1;
        if ('ignore' === attribs?.['data-flecks']) {
          isSkipping = true;
        }
        else if (attribs.src) {
          if (attribs.src.match(/web-vendor\.js$/)) {
            hasVendor = true;
          }
          else {
            js.push(attribs.src);
          }
        }
      }
      if ('style' === tagName && attribs['data-href']) {
        css.push(attribs['data-href']);
      }
      if ('link' === tagName && 'stylesheet' === attribs.rel && attribs.href) {
        css.push(attribs.href);
      }
    },
    ontext(text) {
      if (isInScript > 0 && !isSkipping) {
        inline += text;
      }
    },
  });
  const chunks = [];
  stream.on('data', (chunk) => {
    chunks.push(chunk);
  });
  await new Promise((resolve, reject) => {
    const piped = stream.pipe(parserStream);
    piped.on('error', reject);
    piped.on('finish', resolve);
  });
  // Render document.
  const DocumentElement = React.createElement(
    Document,
    {
      appMountId: flecks.interpolate(appMountId),
      base: flecks.interpolate(base),
      config: React.createElement(
        'script',
        {dangerouslySetInnerHTML: {__html: await configSource(flecks, req)}},
      ),
      css,
      hasVendor,
      icon,
      meta,
      root: React.createElement(await root(flecks, req)),
      title: flecks.interpolate(title),
    },
  );
  return new Promise((resolve) => {
    const rendered = renderToPipeableStream(
      DocumentElement,
      {
        bootstrapScripts: js,
        bootstrapScriptContent: inline,
        onError(error) {
          // eslint-disable-next-line no-console
          console.error('SSR error:', error);
          resolve(Readable.from(Buffer.concat(chunks)));
        },
        onShellError(error) {
          // eslint-disable-next-line no-console
          console.error('SSR shell error:', error);
          resolve(Readable.from(Buffer.concat(chunks)));
        },
        onShellReady() {
          resolve(rendered);
        },
      },
    );
  });
};
