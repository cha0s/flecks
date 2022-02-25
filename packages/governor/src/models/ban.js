export default (flecks) => {
  const {Model, Op, Types} = flecks.fleck('@flecks/db/server');
  const {config: {'@flecks/governor/server': {keys}}} = flecks;
  return class Ban extends Model {

    static get attributes() {
      return {
        ttl: {
          type: Types.INTEGER,
          defaultValue: 0,
        },
        ...Object.fromEntries(keys.map((key) => ([key, {type: Types.STRING}]))),
      };
    }

    static async check(req) {
      const ban = this.fromRequest(req, keys);
      const candidates = Object.entries(ban)
        .reduce((r, [key, value]) => [...r, {[key]: value}], []);
      const where = {
        where: {
          [Op.or]: candidates,
        },
      };
      const bans = await this.findAll(where);
      const pruned = bans
        .reduce((r, ban) => {
          if (ban && ban.ttl > 0) {
            const expiresAt = new Date(ban.createdAt);
            expiresAt.setSeconds(expiresAt.getSeconds() + ban.ttl);
            if (Date.now() >= expiresAt.getTime()) {
              this.destroy({where: {id: ban.id}});
              return [...r, null];
            }
            // eslint-disable-next-line no-param-reassign
            ban.ttl = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);
          }
          return [...r, ban];
        }, [])
        .filter((ban) => !!ban)
        .map((ban) => {
          const {ttl, ...json} = ban.toJSON();
          return json;
        });
      if (0 === pruned.length) {
        return;
      }
      throw new Error(this.format(pruned));
    }

    static format(bans) {
      return [
        'bans = [',
        bans.map((ban) => {
          const entries = Object.entries(ban)
            .filter(([key]) => -1 === ['id', 'createdAt', 'updatedAt'].indexOf(key));
          return [
            '  {',
            entries.map(([key, value]) => `    ${key}: ${value},`).join('\n'),
            '  },',
          ].join('\n');
        }).join('\n'),
        '];',
      ].join('\n');
    }

    static fromRequest(req, keys, ttl = 0) {
      return keys.reduce((r, key) => ({...r, [key]: req[key]}), ttl ? {ttl} : {});
    }

  };

};
