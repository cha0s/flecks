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
  switch (dialect) {
    case 'mysql': {
      args = [
        '-e', `MYSQL_USER=${username}`,
        '-e', `MYSQL_DATABASE=${database}`,
        '-e', `MYSQL_ROOT_PASSWORD=${password}`,
        '-p', `${port}:3306`,
      ];
      image = 'mysql';
      mount = '/var/lib/mysql';
      break;
    }
    case 'postgres': {
      args = [
        '-e', `POSTGRES_USER=${username}`,
        '-e', `POSTGRES_DB=${database}`,
        '-e', `POSTGRES_PASSWORD=${password}`,
        '-p', `${port}:5432`,
      ];
      image = 'postgres';
      mount = '/var/lib/postgresql/data';
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
    },
  };
};
