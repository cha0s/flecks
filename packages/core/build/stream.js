// eslint-disable-next-line max-classes-per-file
const {dump: dumpYml, load: loadYml} = require('js-yaml');
const JsonParse = require('jsonparse');
const {Transform} = require('stream');

exports.JsonStream = class JsonStream extends Transform {

  constructor(decorator) {
    super();
    this.parser = new JsonParse();
    const self = this;
    this.parser.onValue = function onValue(O) {
      if (0 === this.stack.length) {
        self.transformed = JSON.stringify(decorator(O));
      }
    };
    this.transformed = undefined;
  }

  // eslint-disable-next-line no-underscore-dangle
  _flush(done) {
    this.push(this.transformed);
    done();
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    this.parser.write(chunk);
    done();
  }

};

exports.JsonStream.PrettyPrint = class extends exports.JsonStream {

  constructor(decorator, indent = 2) {
    super(decorator);
    const self = this;
    this.parser.onValue = function onValue(O) {
      if (0 === this.stack.length) {
        self.transformed = JSON.stringify(O, null, indent);
      }
    };
  }

};

exports.YamlStream = class YamlStream extends Transform {

  constructor(decorator, options = {dump: {}, load: {}}) {
    super();
    this.buffers = [];
    this.decorator = decorator;
    this.options = options;
  }

  // eslint-disable-next-line no-underscore-dangle
  _flush(done) {
    const yml = loadYml(Buffer.concat(this.buffers).toString(), this.options.load);
    this.push(dumpYml(this.decorator(yml), this.options.dump));
    done();
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    this.buffers.push(chunk);
    done();
  }

};
