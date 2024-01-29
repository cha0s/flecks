export default async (flecks) => {
  const effects = await flecks.invokeSequentialAsync('@flecks/redux.effects');
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
