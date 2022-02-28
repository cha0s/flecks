import environment from './environment';

export default () => {
  const {
    dialect,
    username,
    password,
    port,
    database,
  } = environment();
  let args = [];
  let image;
  let mount;
  let ports = {};
  switch (dialect) {
    case 'mysql': {
      args = [
        '-e', `MYSQL_USER=${username}`,
        '-e', `MYSQL_DATABASE=${database}`,
        '-e', `MYSQL_ROOT_PASSWORD=${password}`,
      ];
      image = 'mysql';
      mount = '/var/lib/mysql';
      ports = {[port]: 3306};
      break;
    }
    case 'postgres': {
      args = [
        '-e', `POSTGRES_USER=${username}`,
        '-e', `POSTGRES_DB=${database}`,
        '-e', `POSTGRES_PASSWORD=${password}`,
      ];
      image = 'postgres';
      mount = '/var/lib/postgresql/data';
      ports = {[port]: 5432};
      break;
    }
    default:
  }
  if (!image) {
    return {};
  }
  return {
    sequelize: {
      args,
      image,
      mount,
      ports,
    },
  };
};
