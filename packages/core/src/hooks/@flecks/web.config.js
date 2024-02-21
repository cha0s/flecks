exports.hook = async (req, flecks) => ({
  id: flecks.get('@flecks/core.id'),
  hi: 'foo',
});
