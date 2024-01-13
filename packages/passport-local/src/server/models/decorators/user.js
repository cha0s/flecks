import bcrypt from 'bcrypt';

export default (User, flecks) => {
  const {Types} = flecks.fleck('@flecks/db/server');

  return class UserLocal extends User {

    static saltRounds = 10;

    static get attributes() {
      return {
        ...super.attributes,
        email: Types.STRING,
        hash: Types.STRING,
      };
    }

    async addHashedPassword(plaintext) {
      this.hash = await bcrypt.hash(plaintext, this.constructor.saltRounds);
      return this;
    }

    validatePassword(plaintext) {
      return bcrypt.compare(plaintext, this.hash);
    }

  };
};
