const {
  closeSync,
  mkdirSync,
  openSync,
  statSync,
} = require('fs');
const {join} = require('path');

try {
  statSync('.gitignore');
  const directory = join('node_modules', '@flecks', 'react');
  mkdirSync(join(directory, 'router'), {recursive: true});
  closeSync(openSync(join(directory, 'context.js'), 'w'));
  closeSync(openSync(join(directory, 'router', 'context.js'), 'w'));
}
// eslint-disable-next-line no-empty
catch (error) {}
