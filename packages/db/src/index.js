export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * The database to connect to.
     */
    database: ':memory:',
    /**
     * SQL dialect.
     *
     * See: https://sequelize.org/v5/manual/dialects.html
     */
    dialect: 'sqlite',
    /**
     * Database server host.
     */
    host: undefined,
    /**
     * Database server password.
     */
    password: undefined,
    /**
     * Database server port.
     */
    port: undefined,
    /**
     * Database server username.
     */
    username: undefined,
  }),
  '@flecks/core.gathered': () => ({
    models: {typeProperty: 'name'},
  }),
};
