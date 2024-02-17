import PropTypes from 'prop-types';
import React from 'react';

const fixupKeys = (key) => (
  Object.entries({
    charset: 'charSet',
  })
    .reduce((key, [from, to]) => key.replace(from, to), key)
);

function Document({
  appMountId,
  base,
  config,
  css,
  hasVendor,
  icon,
  meta,
  root,
  title,
}) {
  return (
    <html lang="en">
      <base href={base} />
      <head>
        <title>{title}</title>
        {icon && <link rel="icon" href={icon} />}
        {css.map((href) => <link href={href} key={href} rel="stylesheet" />)}
        {
          Object.entries(meta)
            .map(([key, value]) => (
              React.createElement('meta', {[fixupKeys(key)]: value, key})
            ))
        }
      </head>
      <body>
        <div id={`${appMountId}-container`}>
          {config}
          <div id={appMountId}>{root}</div>
        </div>
        {hasVendor && <script src="/assets/web-vendor.js" />}
      </body>
    </html>
  );
}

Document.propTypes = {
  appMountId: PropTypes.string.isRequired,
  base: PropTypes.string.isRequired,
  config: PropTypes.element.isRequired,
  css: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasVendor: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.string).isRequired,
  root: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};

export default Document;
