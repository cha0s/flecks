exports.hook = (targets) => {
  // Don't build if there's a fleck target.
  if (targets.has('fleck')) {
    targets.delete('server');
  }
};
