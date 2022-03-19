export default (source) => (
  source
    .replace('__non_webpack_import__', 'import')
    .replace('@preserve ', '')
);
