const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const R = require('./require');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const resolveValidModulePath = (source) => (path) => {
  // Does the file resolve as source?
  try {
    R.resolve(`${source}/${path}`);
    return true;
  }
  catch (error) {
    const ext = extname(path);
    // Try the implicit [path]/index[.ext] variation.
    try {
      R.resolve(`${source}/${dirname(path)}/${basename(path, ext)}/index${ext}`);
      return true;
    }
    catch (error) {
      return false;
    }
  }
};

module.exports = () => ({config, options}) => {
  const {packageJson: {name, files = []}, source} = options;
  // index is not taken for granted.
  config.entryPoints.delete('index');
  // Alias this package.
  config.resolve.alias
    .set(name, join(FLECKS_CORE_ROOT, 'src'));
  // Calculate entry points from `files`.
  files
    .filter(resolveValidModulePath(source))
    .forEach((file) => {
      const trimmed = join(dirname(file), basename(file, extname(file)));
      config
        .entry(trimmed)
        .clear()
        .add(`./src/${trimmed}`);
    });
};
