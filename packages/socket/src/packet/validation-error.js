export default class ValidationError extends Error {

  constructor(...args) {
    const [payload, ...after] = args;
    super(...after);
    this.payload = payload;
  }

}
