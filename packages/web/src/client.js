export const hooks = {
  '@flecks/core.hmr': (path, M, flecks) => {
    if (
      flecks.fleckImplementation(path, '@flecks/web/client.up')
      || M.hooks?.['@flecks/web/client.up']) {
      if (
        flecks.fleckImplementation(path, '@flecks/web/client.up')?.toString()
        !== M.hooks?.['@flecks/web/client.up']?.toString()
      ) {
        throw new Error('@flecks/web/client.up implementation changed!');
      }
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
