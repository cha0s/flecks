// eslint-disable-next-line max-classes-per-file
const JsonParse = require('jsonparse');
const {Transform} = require('stream');

exports.JsonStream = class JsonStream extends Transform {

  constructor() {
    super();
    const self = this;
    this.done = undefined;
    this.parser = new JsonParse();
    this.parser.onValue = function onValue(O) {
      if (0 === this.stack.length) {
        self.push(JSON.stringify(O));
        self.done();
      }
    };
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    this.done = done;
    this.parser.write(chunk);
  }

};

exports.JsonStream.PrettyPrint = class extends Transform {

  constructor(indent = 2) {
    super();
    this.indent = indent;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _transform(chunk, encoding, done) {
    this.push(JSON.stringify(JSON.parse(chunk), null, this.indent));
    done();
  }

};

exports.transform = (fn, opts = {}) => {
  class EasyTransform extends Transform {

    constructor() {
      super(opts);
    }

    // eslint-disable-next-line no-underscore-dangle, class-methods-use-this
    _transform(chunk, encoding, done) {
      fn(chunk, encoding, done, this);
    }

  }
  return new EasyTransform();
};
