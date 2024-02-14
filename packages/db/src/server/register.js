async function register(Models, sequelize) {
  Object.values(Models)
    .filter((Model) => Model.attributes)
    .forEach((Model) => {
      Model.init(Model.attributes, {
        sequelize,
        underscored: true,
        ...(Model.modelOptions || {}),
      });
    });
  const dependencies = {};
  Object.values(Models).forEach((Model) => {
    Model.associate(Models);
  });
  Object.values(Models).forEach((Model) => {
    const associations = Object.entries(Model.associations);
    for (let i = 0; i < associations.length; i++) {
      if (associations[i][1].isSelfAssociation) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if ('BelongsToMany' === associations[i][1].associationType) {
        if (associations[i][1].through.model.isManagedByFlecks) {
          const {name} = associations[i][1].through.model;
          if (!dependencies[name]) {
            dependencies[name] = new Set();
          }
          dependencies[name].add(Model.name);
        }
      }
      if ('BelongsTo' === associations[i][1].associationType) {
        if (!dependencies[Model.name]) {
          dependencies[Model.name] = new Set();
        }
        dependencies[Model.name].add(associations[i][1].target.name);
      }
    }
  });
  const entries = Object.values(Models);
  let lastLength = entries.length;
  while (entries.length > 0) {
    for (let i = 0; i < entries.length; i++) {
      const Model = entries[i];
      if (
        !dependencies[Model.name]
        || 0 === dependencies[Model.name].length
      ) {
        // eslint-disable-next-line no-await-in-loop
        await Model.sync(); await Model.sync();
        const dependents = Object.keys(dependencies);
        for (let j = 0; j < dependents.length; j++) {
          const dependent = dependents[j];
          if (dependencies[dependent].has(Model.name)) {
            dependencies[dependent].delete(Model.name);
            if (0 === dependencies[dependent].size) {
              delete dependencies[dependent];
            }
          }
        }
        entries.splice(i, 1);
        break;
      }
    }
    if (entries.length === lastLength) {
      throw new TypeError(`@flecks/db circular dependencies: '${entries.join("', '")}'`);
    }
    lastLength = entries.length;
  }
}

export default register;
