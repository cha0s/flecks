const {basename, dirname, join} = require('path');

const {JsonStream} = require('./stream');
const FileTree = require('./tree');

exports.move = async (name, source) => {
  const fileTree = await FileTree.loadFrom(source);
  // Renamed to avoid conflicts.
  fileTree.glob('**/*.noconflict')
    .forEach((path) => {
      fileTree.move(path, join(dirname(path), basename(path, '.noconflict')));
    });
  // Add project name to `package.json`.
  fileTree.pipe('package.json', new JsonStream((json) => ({name, ...json})));
  return fileTree;
};
