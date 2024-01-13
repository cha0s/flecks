export default (flecks) => {
  const {Model} = flecks.fleck('@flecks/db/server');

  return class User extends Model {

    static associate({Group}) {
      this.belongsToMany(Group, {through: 'user_groups'});
    }

  };
};
