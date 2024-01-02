import {
  stat,
} from 'fs/promises';
import {basename, dirname, join} from 'path';

import {JsonStream, transform} from '@flecks/core/server';

import FileTree from './tree';

const testDestination = async (destination) => {
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

export default async (name, source, destination, type, flecks) => {
  if (!await testDestination(destination)) {
    const error = new Error(
      `@flecks/create-fleck: destination '${destination} already exists: aborting`,
    );
    error.code = 129;
    throw error;
  }
  const fileTree = await FileTree.loadFrom(source);
  // Renamed to avoid conflicts.
  const {files} = fileTree;
  fileTree.glob('**/*.noconflict')
    .forEach((path) => {
      files[join(dirname(path), basename(path, '.noconflict'))] = files[path];
      delete files[path];
    });
  // Defaults.
  flecks.set(
    `@flecks/create-${type}.packager`,
    flecks.get(`@flecks/create-${type}.packager`, ['...']),
  );
  // Send it out.
  await flecks.invokeSequentialAsync(`@flecks/create-${type}/packager`, fileTree);
  // Add project name to `package.json`.
  fileTree.pipe(
    'package.json',
    transform((chunk, encoding, done, stream) => {
      stream.push(JSON.stringify({name, ...JSON.parse(chunk)}));
      done();
    }),
  );
  // Pretty print all JSON.
  fileTree.glob('**/*.json')
    .forEach((path) => {
      fileTree.pipe(path, new JsonStream.PrettyPrint());
    });
  // Write the tree.
  await fileTree.writeTo(destination);
};
