export default (flecks) => {
  const {Model, Types} = flecks.fleck('@flecks/db/server');

  return class Group extends Model {

    static get attributes() {
      return {
        name: Types.STRING,
        label: Types.STRING,
      };
    }

    static associate({User}) {
      this.belongsToMany(User, {through: 'user_groups'});
    }

  };
};
