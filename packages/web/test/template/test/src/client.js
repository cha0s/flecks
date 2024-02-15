export const hooks = {
  '@flecks/web/client.up': async (container, flecks) => {
    container.innerHTML = 'hello world';
    await flecks.web.test({
      type: 'report',
      payload: {
        id: flecks.get('@flecks/web.appMountId'),
        config: flecks.get('test'),
        env: process.env.NODE_ENV,
      },
    });
  },
};
