const cluster = require('cluster');
const {join} = require('path');

const {prefixLines} = require('@flecks/core/build/stream');
const chalk = require('chalk');

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
    let lastStartHadErrors = false;
    compiler.hooks.afterEmit.tapPromise(pluginName, async (compilation) => {
      if (compilation.errors.length > 0) {
        lastStartHadErrors = true;
        return;
      }
      if (this.worker && this.worker.isConnected()) {
        if (signal && !lastStartHadErrors) {
          process.kill(
            this.worker.process.pid,
            true === signal ? 'SIGUSR2' : signal,
          );
          return;
        }
        const promise = new Promise((resolve) => {
          this.worker.on('disconnect', resolve);
        });
        this.worker.disconnect();
        await promise;
      }
      lastStartHadErrors = false;
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
      await this.startServer(join(compiler.options.output.path, entryPoint));
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
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      ...(inspectPort && {inspectPort}),
    });
    this.worker = cluster.fork({
      ...env,
    });
    ['stdout', 'stderr'].forEach((stream) => {
      prefixLines(this.worker.process[stream], chalk.blue('[SRV] '))
        .pipe(process[stream]);
    });
    this.worker.on('exit', (code) => {
      if (killOnExit && !this.worker.exitedAfterDisconnect) {
        process.send({type: 'kill', payload: code});
        process.exit(code);
      }
    });
    this.worker.on('disconnect', () => {
      if (this.worker.exitedAfterDisconnect) {
        // eslint-disable-next-line no-console
        console.error('[HMR] Restarting application...');
        process.send({type: 'restart'});
      }
    });
    return new Promise((resolve, reject) => {
      this.worker.on('error', reject);
      this.worker.on('online', resolve);
    });
  }

}

module.exports = (pluginOptions = {}) => (
  new StartServerPlugin(pluginOptions)
);
