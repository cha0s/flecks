const {mkdir, readFile, writeFile} = require('fs/promises');
const {join, relative, resolve} = require('path');

const {
  generateDocusaurus,
  generateJson,
  generateDocusaurusStyle,
} = require('./generate');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = (program, flecks) => {
  const commands = {};
  commands.dox = {
    description: 'Generate documentation',
    action: async (subcommand, outputPath, {rewriteFilenames = []}) => {
      let actualOutputPath = outputPath;
      if (!actualOutputPath) {
        switch (subcommand) {
          case 'docusaurus':
            actualOutputPath = 'website/docs/flecks';
            break;
          case 'json':
            actualOutputPath = 'dist/dox';
            break;
          default:
            break;
        }
      }
      actualOutputPath = resolve(FLECKS_CORE_ROOT, actualOutputPath);
      await mkdir(actualOutputPath, {recursive: true});
      let output;
      const json = await generateJson(flecks);
      const pairs = rewriteFilenames
        .map((pair) => {
          const index = pair.indexOf('=');
          return [pair.slice(0, index), pair.slice(index + 1)];
        })
        .concat(flecks.get('@flecks/dox.rewriteFilenames'))
        .map(([from, to]) => [new RegExp(from, 'g'), to]);
      const rewrite = (array) => (
        array.map(
          (object) => ({
            ...object,
            filename: pairs.reduce(
              (filename, [from, to]) => filename.replace(from, to),
              object.filename,
            ),
          }),
        )
      );
      json.hooks = Object.fromEntries(
        Object.entries(json.hooks)
          .map(([hook, {implementations, invocations, specification}]) => (
            [
              hook,
              {
                implementations: rewrite(implementations),
                invocations: rewrite(invocations),
                specification,
              },
            ]
          )),
      );
      json.todos = rewrite(json.todos);
      switch (subcommand) {
        case 'docusaurus':
          output = Object.fromEntries(
            Object.entries(generateDocusaurus(json))
              .map(([type, page]) => [`${type}.mdx`, page]),
          );
          output['dox.module.css'] = await generateDocusaurusStyle();
          break;
        case 'json':
          output = Object.fromEntries(
            Object.entries(json)
              .map(([type, value]) => [`${type}.json`, JSON.stringify(value, null, 2)]),
          );
          break;
        default:
          break;
      }
      await Promise.all(
        Object.entries(output)
          .map(([filename, output]) => (
            writeFile(join(actualOutputPath, filename), output)
          )),
      );
      // eslint-disable-next-line no-console
      console.log("Output documentation to '%s'", relative(FLECKS_CORE_ROOT, actualOutputPath));
    },
    args: [
      program.createArgument('subcommand', 'Generation type')
        .choices(['docusaurus', 'json']),
      program.createArgument('[output path]', 'Where the files are output'),
    ],
    options: [
      program.createOption('-r, --rewrite-filenames [pairs...]', 'rewrite filenames'),
    ],
  };
  return commands;
};
