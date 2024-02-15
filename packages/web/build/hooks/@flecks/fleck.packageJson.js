exports.hook = (json, compilation) => {
  if (Object.keys(compilation.assets).some((filename) => filename.match(/^assets\//))) {
    json.files.push('assets');
  }
};
