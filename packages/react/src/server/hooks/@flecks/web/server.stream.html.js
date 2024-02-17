import {Readable} from 'stream';

import React from 'react';
import {renderToPipeableStream} from 'react-dom/server';

import {Flecks} from '@flecks/core';
import {pipesink} from '@flecks/core/server';
import {configSource} from '@flecks/web/server';
import {createRootElement} from '@flecks/react/create-root-element';

import DocumentComponent from './_document';
import {parseHtml} from './_parse-html';

export const hook = Flecks.priority(
  async (stream, req, res, flecks) => {
    if (!flecks.get('@flecks/react.ssr')) {
      return stream;
    }
    const {
      appMountId,
      base,
      icon,
      meta,
      title,
    } = flecks.get('@flecks/web');
    // Fallback.
    const fallback = pipesink(stream);
    // Extract assets from HTML generated up to this point.
    const {
      css,
      hasVendor,
      inline,
      js,
    } = await parseHtml(stream);
    // Render document.
    const DocumentElement = React.createElement(
      DocumentComponent,
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
        root: await createRootElement(flecks, req, res),
        title: flecks.interpolate(title),
      },
    );
    return new Promise((resolve) => {
      const rendered = renderToPipeableStream(
        DocumentElement,
        {
          bootstrapScripts: js,
          bootstrapScriptContent: inline,
          async onError(error) {
            // eslint-disable-next-line no-console
            console.error('SSR error:', error);
            resolve(Readable.from(await fallback));
          },
          async onShellError(error) {
            // eslint-disable-next-line no-console
            console.error('SSR shell error:', error);
            resolve(Readable.from(await fallback));
          },
          onShellReady() {
            resolve(rendered);
          },
        },
      );
    });
  },
  {after: '@flecks/web/server'},
);
