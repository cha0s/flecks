import {WritableStream} from 'htmlparser2/lib/WritableStream';

export async function parseHtml(stream) {
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
  await new Promise((resolve, reject) => {
    const piped = stream.pipe(parserStream);
    piped.on('error', reject);
    piped.on('finish', resolve);
  });
  return {
    css,
    hasVendor,
    inline,
    js,
  };
}
