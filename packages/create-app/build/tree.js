const {createReadStream, createWriteStream} = require('fs');
const {mkdir, stat} = require('fs/promises');

const {glob} = require('@flecks/core/server');
const minimatch = require('minimatch');
const {dirname, join} = require('path');

module.exports = class FileTree {

  constructor(files = {}) {
    this.files = files;
  }

  addDirectory(path) {
    this.files[path] = null;
  }

  addFile(path, stream) {
    this.files[path] = stream;
  }

  glob(glob) {
    return Object.keys(this.files).filter((path) => minimatch(path, glob, {dot: true}));
  }

  static async loadFrom(cwd) {
    const paths = await glob('**/*', {cwd, dot: true});
    return new FileTree(
      await paths
        .reduce(
          async (r, path) => {
            const origin = join(cwd, path);
            const stats = await stat(origin);
            return {
              ...await r,
              [path]: stats.isDirectory() ? null : createReadStream(origin),
            };
          },
          {},
        ),
    );
  }

  pipe(path, stream) {
    this.files[path] = this.files[path] ? this.files[path].pipe(stream) : undefined;
  }

  async writeTo(destination) {
    return Promise.all(
      Object.entries(this.files)
        .map(async ([path, stream]) => {
          if (null === stream) {
            return mkdir(join(destination, path), {recursive: true});
          }
          await mkdir(dirname(join(destination, path)), {recursive: true});
          return new Promise((resolve, reject) => {
            const writer = createWriteStream(join(destination, path));
            writer.on('finish', resolve);
            writer.on('error', reject);
            stream.pipe(writer);
          });
        }),
    );
  }

};
