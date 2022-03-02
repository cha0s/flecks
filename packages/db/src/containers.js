export default (flecks) => {
  const {
    dialect,
    username,
    password,
    port,
    database,
  } = flecks.get('@flecks/db/server');
  let environment = {
    app: {
      host: 'sequelize',
    },
  };
  let image;
  let mount;
  let ports = {};
  switch (dialect) {
    case 'mysql': {
      environment = {
        ...environment,
        sequelize: {
          MYSQL_USER: username,
          MYSQL_DATABASE: database,
          MYSQL_ROOT_PASSWORD: password,
        },
      };
      image = 'mysql';
      mount = '/var/lib/mysql';
      ports = {[port || 3306]: 3306};
      break;
    }
    case 'postgres': {
      environment = {
        ...environment,
        sequelize: {
          POSTGRES_USER: username,
          POSTGRES_DB: database,
          POSTGRES_PASSWORD: password,
        },
      };
      image = 'postgres';
      mount = '/var/lib/postgresql/data';
      ports = {[port || 5432]: 5432};
      break;
    }
    default:
  }
  if (!image) {
    return {};
  }
  return {
    sequelize: {
      environment,
      image,
      mount,
      ports,
    },
  };
};
