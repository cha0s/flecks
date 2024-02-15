exports.hook = (flecks) => [
  'web',
  ...(flecks.get('@flecks/web.dll').length > 0 ? ['web-vendor'] : []),
];
