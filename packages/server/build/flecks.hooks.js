export const hooks = {

  /**
   * Pass information to the runtime.
   * @invoke Async
   */
  '@flecks/server.runtime': async () => ({
    something: '...',
  }),

  /**
   * Respond to server test socket actions.
   *
   * @param {Object} action The action.
   * @param {SocketWrapper} socket The socket.
   */
  '@flecks/server.test.socket': (action, socket) => {
    const {meta, payload, type} = action;
    switch (type) {
      case 'my.custom.action':
        socket.write(JSON.stringify({
          meta,
          payload: 'my-test-response',
        }));
        break;
      default:
    }
  },

  /**
   * Define sequential actions to run when the server comes up.
   * @invoke SequentialAsync
   */
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },

};
