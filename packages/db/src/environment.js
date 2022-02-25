const {
  SEQUELIZE_DIALECT = 'sqlite',
  SEQUELIZE_USER = 'user',
  SEQUELIZE_PASSWORD = 'Set_The_SEQUELIZE_PASSWORD_Environment_Variable',
  SEQUELIZE_HOST = 'localhost',
  SEQUELIZE_PORT,
  SEQUELIZE_DATABASE = ':memory:',
} = process.env;

export default () => {
  if ('sqlite' === SEQUELIZE_DIALECT) {
    return ({
      dialect: 'sqlite',
      storage: SEQUELIZE_DATABASE,
    });
  }
  return ({
    dialect: SEQUELIZE_DIALECT,
    username: SEQUELIZE_USER,
    password: SEQUELIZE_PASSWORD,
    host: SEQUELIZE_HOST,
    port: SEQUELIZE_PORT,
    database: SEQUELIZE_DATABASE,
  });
};
