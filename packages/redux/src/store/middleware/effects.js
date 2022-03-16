export default (flecks) => {
  const effects = flecks.invokeFlat('@flecks/redux.effects');
  const effect = (store, action) => {
    effects.forEach((map) => {
      if (map[action.type]) {
        map[action.type](store, action);
      }
    });
  };
  return (store) => (next) => (action) => {
    const result = next(action);
    setTimeout(() => effect(store, action), 0);
    return result;
  };
};
