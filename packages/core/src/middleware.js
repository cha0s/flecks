export default class Middleware {

  constructor(middleware = []) {
    this.middleware = [];
    for (let i = 0; i < middleware.length; ++i) {
      this.middleware.push(this.constructor.check(middleware[i]));
    }
  }

  static check(middleware) {
    if ('function' !== typeof middleware) {
      if ('undefined' !== typeof middleware.then) {
        throw new TypeError('middleware expected a function, looks like a promise');
      }
      throw new TypeError('middleware expected a function');
    }
    return middleware;
  }

  dispatch(...args) {
    const fn = args.pop();
    const middleware = this.middleware.concat();
    const invoke = (error) => {
      if (middleware.length > 0) {
        const current = middleware.shift();
        // Check mismatch.
        if ((args.length + 2 === current.length) === !error) {
          invoke(error);
        }
        // Invoke.
        else {
          try {
            current(...args.concat(error ? [error] : []).concat(invoke));
          }
          catch (error) {
            invoke(error);
          }
        }
      }
      // Finish...
      else if (fn) {
        setTimeout(() => fn(error), 0);
      }
    };
    invoke();
  }

  promise(...args) {
    return new Promise((resolve, reject) => {
      this.dispatch(...(args.concat((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      })));
    });
  }

  use(fn) {
    this.middleware.push(this.constructor.check(fn));
  }

}
