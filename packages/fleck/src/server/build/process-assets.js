class ProcessAssets {

  constructor(flecks) {
    this.flecks = flecks;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('@flecks/fleck/server/build/process-assets', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: '@flecks/fleck/server/build/process-assets',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async (assets, callback) => {
          await this.flecks.invokeSequentialAsync(
            '@flecks/fleck/server.processAssets',
            assets,
            compilation,
          );
          callback();
        },
      );
    });
  }

}

module.exports = ProcessAssets;
