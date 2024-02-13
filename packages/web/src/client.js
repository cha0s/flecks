export const hooks = {
  '@flecks/core.hmr': (path, M, flecks) => {
    if (flecks.implementationChanged(path, '@flecks/web/client.up', M)) {
      throw new Error('@flecks/web/client.up implementation changed!');
    }
  },
};

export const mixin = (Flecks) => class FlecksWithWebClient extends Flecks {

  constructor(runtime) {
    super(runtime);
    if ('test' !== process.env.NODE_ENV) {
      return;
    }
    this.web = {
      test: ({payload, type}) => (
        fetch(
          `/@flecks/web/testing?type=${type}`,
          {
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )
      ),
    };
  }

};
