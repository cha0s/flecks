const {open, writeFile} = require('fs/promises');

exports.writeFile = async (
  path,
  content,
  paramaterizedOptions,
) => {
  const options = {
    flags: 'w',
    mode: 0o666,
    ...paramaterizedOptions,
  };
  const filehandle = await open(path, options.flags, options.mode);
  await writeFile(filehandle, content, options);
  await filehandle.sync();
  await filehandle.close();
};
