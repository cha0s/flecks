export default (flecks) => {
  const {Model, Types} = flecks.fleck('@flecks/db/server');

  return class Permission extends Model {

    static get attributes() {
      return {
        name: Types.STRING,
        label: Types.STRING,
      };
    }

    static associate({Group}) {
      this.belongsToMany(Group, {through: 'group_permissions'});
    }

  };
};
