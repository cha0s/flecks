export default async (flecks, hook, ...args) => {
  const track = {};
  return Object.entries(flecks.invoke(hook, ...args))
    .reduce(async (r, [pkg, impl]) => {
      const aimpl = await impl;
      Object.keys(aimpl).forEach((key) => {
        if (track[key]) {
          throw new ReferenceError(
            `Conflict in ${hook}: '${track[key]}' implemented '${key}', followed by '${pkg}'`,
          );
        }
        track[key] = pkg;
      });
      return {...(await r), ...aimpl};
    }, {});
};
