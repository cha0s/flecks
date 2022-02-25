import {Model as SeqModel} from 'sequelize';

class Model extends SeqModel {

  static associate() {}

  static get attributes() {
    return {};
  }

  static get isManagedByFlecks() {
    return true;
  }

}

export default Model;
