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
  } = flecks.get('@flecks/web/server');
  // Extract assets.
  const css = [];
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
          js.push(attribs.src);
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
        onError() {
          resolve(stream);
        },
        onShellError() {
          resolve(stream);
        },
        onShellReady() {
          resolve(rendered);
        },
      },
    );
  });
};
