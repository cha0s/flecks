/**
 * Hook into neutrino configuration.
 * @param {string} target - The build target; e.g. `server`.
 * @param {Object} config - The neutrino configuration.
 */
hooks['@flecks/core/build'] = (target, config) => {};

/**
 * Alter build configurations after they have been hooked.
 * @param {Object} configs - The neutrino configurations.
 */
hooks['@flecks/core/build/alter'] = (configs) => {};

/**
 * Define CLI commands.
 */
hooks['@flecks/core/commands'] = (program) => {};

/**
 * Define configuration.
 */
hooks['@flecks/core/config'] = () => {};

/**
 * Alter configuration.
 * @param {Object} config - The neutrino configuration.
 */
hooks['@flecks/core/config/alter'] = (config) => {};

/**
 * Invoked when a gathered class is HMR'd.
 * @param {constructor} Class - The class.
 * @param {string} hook - The gather hook; e.g. `@flecks/db/server/models`.
 */
hooks['@flecks/core/gathered/hmr'] = (Class, hook) => {};

 /**
 * Invoked when a fleck is HMR'd
 * @param {constructor} Class - The class.
 * @param {string} hook - The gather hook; e.g. `@flecks/db/server/models`.
 */
hooks['@flecks/core/hmr'] = (Class, hook) => {};

/**
 * Invoked when the application is starting. Use for order-independent initialization tasks.
 */
hooks['@flecks/core/starting'] = () => {};

/**
 * Define neutrino build targets.
 */
hooks['@flecks/core/targets'] = () => {};

/**
 * Hook into webpack configuration.
 * @param {string} target - The build target; e.g. `server`.
 * @param {Object} config - The neutrino configuration.
 */
hooks['@flecks/core/webpack'] = (target, config) => {};
