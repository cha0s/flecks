import React from 'react';

export default function ImageRow({children}) {
  return (
    <div style={{display: 'flex', marginBottom: 'var(--ifm-leading)'}}>
      {React.Children.map(children, (child, i) => {
        const count = React.Children.count(children);
        return React.cloneElement(
          child,
          {
            style: {
              marginLeft: 0 === i ? '0' : `calc(var(--ifm-spacing-horizontal) * 1 / ${count - 1})`,
              width: `calc(${100 / count}% - var(--ifm-spacing-horizontal) / ${count})`,
            },
          },
        );
      })}
   </div>
  );
}