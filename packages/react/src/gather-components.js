import React from 'react';

export default (implementations) => (
  Object.entries(implementations)
    .map(([fleck, ComponentOrComponentsOrTuples]) => (
      [].concat([ComponentOrComponentsOrTuples]).map((ComponentOrTuple, i) => {
        const key = `${fleck}(${i})`;
        if (Array.isArray(ComponentOrTuple)) {
          return React.createElement(ComponentOrTuple[0], {key, ...ComponentOrTuple[1]});
        }
        return React.createElement(ComponentOrTuple, {key});
      })
    ))
    .flat()
);
