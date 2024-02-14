import cluster from 'cluster';

export const hook = (hook) => {
  if ('@flecks/server.up' === hook) {
    if (cluster.isWorker) {
      cluster.worker.disconnect();
      const error = new Error('@flecks/server.up implementation changed!');
      error.stack = '';
      throw error;
    }
  }
};
