export const hooks = {
  '@flecks/web/server.stream.html': async (stream, req) => {
    req.abort();
  },
};
