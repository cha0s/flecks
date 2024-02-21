// eslint-disable-next-line max-classes-per-file, import/no-extraneous-dependencies
const {Buffer} = require('buffer');
const {EOL} = require('os');
const {Transform, Writable} = require('stream');

const {dump: dumpYml, load: loadYml} = require('js-yaml');
const JsonParse = require('jsonparse');

const linebreak = /\r?\n/;

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

exports.LineStream = class LineStream extends Transform {

  constructor(encoding = 'utf8') {
    super();
    this.encoding = encoding;
    this.buffer = '';
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    const string = chunk.toString(this.encoding);
    if (!string.match(linebreak)) {
      this.buffer += string;
      done();
      return;
    }
    const parts = (this.buffer + string).split(linebreak);
    this.buffer = parts.pop();
    for (let i = 0; i < parts.length; ++i) {
      this.push(parts[i]);
    }
    done();
  }

};

exports.pipesink = (stream, {concat = Buffer.concat} = {}) => {
  class Sink extends Writable {

    constructor() {
      super();
      this.chunks = [];
    }

    // eslint-disable-next-line no-underscore-dangle
    _write(chunk, encoding, done) {
      this.chunks.push(chunk);
      done();
    }

  }
  const sink = new Sink();
  return new Promise((resolve, reject) => {
    stream.pipe(sink);
    stream.on('error', reject);
    stream.on('end', () => {
      resolve(concat(sink.chunks));
    });
  });
};

exports.prefixLines = (stream, prefix) => (
  stream
    .pipe(new exports.LineStream())
    .pipe(new class Stdio extends Transform {

      // eslint-disable-next-line no-underscore-dangle, class-methods-use-this
      _transform(chunk, encoding, done) {
        this.push(prefix);
        this.push(chunk);
        this.push(EOL);
        done();
      }

    }())
);

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
