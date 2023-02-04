const cluster = require('cluster');

class StartServerPlugin {

  pluginName = 'StartServerPlugin';

  worker = null;

  constructor(options = {}) {
    this.options = 'string' === typeof options
      ? {name: options}
      : {
        args: [],
        nodeArgs: [],
        signal: false,
        ...options,
      };
  }

  apply(compiler) {
    const {options: {exec, signal}, pluginName} = this;
    const logger = compiler.getInfrastructureLogger(pluginName);
    compiler.hooks.afterEmit.tapAsync(pluginName, (compilation, callback) => {
      if (this.worker && this.worker.isConnected()) {
        if (signal) {
          process.kill(this.worker.process.pid, true === signal ? 'SIGUSR2' : signal);
        }
        callback();
        return;
      }
      let entryPoint;
      if (!exec) {
        entryPoint = compilation.assets[Object.keys(compilation.assets)[0]].existsAt;
      }
      else if (compilation.assets[exec]) {
        entryPoint = compilation.assets[exec].existsAt;
      }
      else if ('string' === typeof exec) {
        entryPoint = exec;
      }
      else {
        entryPoint = exec(compilation);
      }
      this.startServer(
        entryPoint,
        callback,
      );
    });
    compiler.hooks.shouldEmit.tap(pluginName, (compilation) => {
      const entryPoints = Object.keys(compilation.assets);
      if ('string' === typeof exec) {
        return true;
      }
      if (!exec && entryPoints.length > 1) {
        logger.warn(`No entrypoint selected, defaulting to '${entryPoints[0]}'. Other entrypoints: '${entryPoints.slice(1).join("', '")}'`);
      }
      return true;
    });
  }

  static inspectPortFromExecArgv(execArgv) {
    const inspectArg = execArgv.find((arg) => arg.includes('--inspect'));
    if (!inspectArg || !inspectArg.includes('=')) {
      return undefined;
    }
    const [, hostPort] = inspectArg.split('=');
    const port = hostPort.includes(':') ? hostPort.split(':')[1] : hostPort;
    return parseInt(port, 10);
  }

  startServer(exec, callback) {
    const {args, nodeArgs} = this.options;
    const execArgv = nodeArgs.concat(process.execArgv);
    const inspectPort = this.constructor.inspectPortFromExecArgv(execArgv);
    cluster.setupPrimary({
      exec,
      execArgv,
      args,
      ...(inspectPort && {inspectPort}),
    });
    cluster.on('online', () => callback());
    this.worker = cluster.fork();
  }

}

module.exports = ({
  nodeArgs = [],
  pluginId = 'start-server',
  ...pluginOptions
} = {}) => (
  ({config, options}) => {
    config
      .plugin(pluginId)
      .use(
        StartServerPlugin,
        [{...pluginOptions, nodeArgs: nodeArgs.concat(options.debug ? ['--inspect'] : [])}],
      );
  }
);