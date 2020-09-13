import Sequelize from 'sequelize';
import File from '../app/models/File';
import Company from '../app/models/Company';
import Contract from '../app/models/Contract';
import User from '../app/models/User';
import Unit from '../app/models/Unit';
import Category from '../app/models/Category';
import Provider from '../app/models/Provider';
import Product from '../app/models/Product';

import databaseConfig from '../config/database';

const models = [
  File,
  Company,
  Contract,
  User,
  Unit,
  Category,
  Provider,
  Product,
];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new DataBase();
