const {stat} = require('fs/promises');
const {basename, dirname, join} = require('path');

const {transform} = require('@flecks/core/server');

const FileTree = require('./tree');

exports.testDestination = async (destination) => {
  try {
    await stat(destination);
    return false;
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    return true;
  }
};

exports.move = async (name, source) => {
  const fileTree = await FileTree.loadFrom(source);
  // Renamed to avoid conflicts.
  const {files} = fileTree;
  fileTree.glob('**/*.noconflict')
    .forEach((path) => {
      files[join(dirname(path), basename(path, '.noconflict'))] = files[path];
      delete files[path];
    });
  // Add project name to `package.json`.
  fileTree.pipe(
    'package.json',
    transform((chunk, encoding, done, stream) => {
      stream.push(JSON.stringify({name, ...JSON.parse(chunk)}));
      done();
    }),
  );
  return fileTree;
};
