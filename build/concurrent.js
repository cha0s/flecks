module.exports = async function concurrent(inputs, task, jobs = require('os').cpus().length) {
  const workers = new Array(jobs).fill(Promise.resolve(0));
  inputs.forEach((input, i) => {
    // then= :)
    workers[i % jobs] = workers[i % jobs].then(async (code) => await task(input) || code);
  });
  return (await Promise.all(workers)).find((code) => code !== 0) || 0;
};
