const createListener = (fn, that, type, once) => ({
  fn,
  that,
  type,
  once,
  bound: that ? fn.bind(that) : fn,
});

export default function EventEmitterDecorator(Superclass) {

  return class EventEmitter extends Superclass {

    constructor(...args) {
      super(...args);
      this.$$events = Object.create(null);
    }

    addListener(typesOrType, fn, that) {
      return this.on(typesOrType, fn, that);
    }

    // Notify ALL the listeners!
    emit(type, ...args) {
      const typeListeners = this.$$events[type];
      if (typeListeners && typeListeners.length > 0) {
        this.emitToListeners(typeListeners, args);
      }
    }

    emitToListeners(listeners, args) {
      for (let i = 0; i < listeners.length; ++i) {
        const {
          once,
          type,
          fn,
          bound,
          that,
        } = listeners[i];
        // Remove if only once.
        if (once) {
          this.offSingleEvent(type, fn);
        }
        // Fast path...
        if (0 === args.length) {
          bound();
        }
        else if (1 === args.length) {
          bound(args[0]);
        }
        else if (2 === args.length) {
          bound(args[0], args[1]);
        }
        else if (3 === args.length) {
          bound(args[0], args[1], args[2]);
        }
        else if (4 === args.length) {
          bound(args[0], args[1], args[2], args[3]);
        }
        else if (5 === args.length) {
          bound(args[0], args[1], args[2], args[3], args[4]);
        }
        // Slow path...
        else {
          fn.apply(that, args);
        }
      }
    }

    off(typesOrType, fn) {
      const types = Array.isArray(typesOrType) ? typesOrType : [typesOrType];
      for (let i = 0; i < types.length; i++) {
        this.offSingleEvent(types[i], fn);
      }
      return this;
    }

    offSingleEvent(type, fn) {
      if ('function' !== typeof fn) {
        // Only type.
        if (type in this.$$events) {
          this.$$events[type] = [];
        }
        return;
      }
      // Function.
      if (!(type in this.$$events)) {
        return;
      }
      this.$$events[type] = this.$$events[type].filter((listener) => listener.fn !== fn);
    }

    on(typesOrType, fn, that = undefined) {
      this.$$on(typesOrType, fn, that, false);
      return this;
    }

    $$on(typesOrType, fn, that, once) {
      const types = Array.isArray(typesOrType) ? typesOrType : [typesOrType];
      for (let i = 0; i < types.length; i++) {
        this.onSingleEvent(types[i], fn, that, once);
      }
    }

    once(types, fn, that = undefined) {
      this.$$on(types, fn, that, true);
      return this;
    }

    onSingleEvent(type, fn, that, once) {
      if ('function' !== typeof fn) {
        throw new TypeError('EventEmitter::onSingleEvent() requires function listener');
      }
      const listener = createListener(fn, that, type, once);
      if (!(type in this.$$events)) {
        this.$$events[type] = [];
      }
      this.$$events[type].push(listener);
    }

    removeListener(...args) {
      return this.off(...args);
    }

  };

}
