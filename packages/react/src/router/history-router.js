/* eslint-disable react/prop-types */

// redux-first-router/rr6 doesn't honor hoisting.

const {createElement, useLayoutEffect, useState} = require('react');
const {Router} = require('react-router');

exports.HistoryRouter = function HistoryRouter({basename, children, history}) {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);
  // eslint-disable-next-line react/no-children-prop
  return createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
  });
}
