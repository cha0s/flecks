const cluster = require('cluster');
const {join} = require('path');

class StartServerPlugin {

  pluginName = 'StartServerPlugin';

  worker = null;

  constructor(options = {}) {
    this.options = {
      args: [],
      env: {},
      killOnExit: true,
      nodeArgs: [],
      signal: false,
      ...('string' === typeof options ? {name: options} : options),
    };
    ['exit', 'SIGINT', 'SIGTERM']
      .forEach((event) => {
        process.on(event, () => {
          this.worker?.kill('exit' === event ? 'SIGKILL' : event);
        });
      });
  }

  apply(compiler) {
    const {options: {exec, signal}, pluginName} = this;
    const logger = compiler.getInfrastructureLogger(pluginName);
    compiler.hooks.afterEmit.tapPromise(pluginName, async (compilation) => {
      if (this.worker && this.worker.isConnected()) {
        if (signal) {
          this.worker.kill(true === signal ? 'SIGUSR2' : signal);
          return undefined;
        }
        const promise = new Promise((resolve) => {
          this.worker.on('disconnect', resolve);
        });
        this.worker.disconnect();
        await promise;
      }
      let entryPoint;
      if (!exec) {
        entryPoint = compilation.getPath(Object.keys(compilation.assets)[0]);
      }
      else if (compilation.assets[exec]) {
        entryPoint = compilation.getPath(exec);
      }
      else if ('string' === typeof exec) {
        entryPoint = exec;
      }
      else {
        entryPoint = exec(compilation);
      }
      return this.startServer(join(compiler.options.output.path, entryPoint));
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

  async startServer(exec) {
    const {
      args,
      env,
      killOnExit,
      nodeArgs,
    } = this.options;
    const execArgv = nodeArgs.concat(process.execArgv);
    const inspectPort = this.constructor.inspectPortFromExecArgv(execArgv);
    cluster.setupPrimary({
      exec,
      execArgv,
      args,
      ...(inspectPort && {inspectPort}),
    });
    this.worker = cluster.fork(env);
    if (killOnExit) {
      this.worker.on('exit', (code) => {
        process.exit(code);
      });
    }
    else {
      this.worker.on('disconnect', () => {
        if (this.worker.exitedAfterDisconnect) {
          // eslint-disable-next-line no-console
          console.error('[HMR] Restarting application...');
          process.send('restart');
        }
      });
    }
    return new Promise((resolve, reject) => {
      this.worker.on('error', reject);
      this.worker.on('online', resolve);
    });
  }

}

module.exports = (pluginOptions = {}) => (
  new StartServerPlugin(pluginOptions)
);
