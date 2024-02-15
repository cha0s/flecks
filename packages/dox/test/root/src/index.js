export const hooks = {
  '@flecks/build.files': () => (['file']),
  '@flecks/core.config': () => ({
    foo: 'bar',
  }),
  '@something/else': () => {},
};

export function whatever(flecks) {
  flecks.invoke('@something/else');
  // @todo Skipped cuz not class.
  this.invoke('@something/blah');
}
