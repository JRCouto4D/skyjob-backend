import Sequelize from 'sequelize';
import File from '../app/models/File';
import Company from '../app/models/Company';
import Contract from '../app/models/Contract';
import User from '../app/models/User';
import Unit from '../app/models/Unit';
import Category from '../app/models/Category';
import Provider from '../app/models/Provider';
import Product from '../app/models/Product';
import Cash_register from '../app/models/Cash_register';
import Point_sale from '../app/models/Point_sale';
import Reinforcements from '../app/models/Reinforcement';
import Bleed from '../app/models/Bleed';
import Sale from '../app/models/Sale';
import Item from '../app/models/Item';
import Return from '../app/models/Return';
import Customer from '../app/models/Customer';
import Invoice from '../app/models/Invoice';
import Invoice_item from '../app/models/Invoice_item';

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
  Cash_register,
  Point_sale,
  Reinforcements,
  Bleed,
  Sale,
  Item,
  Return,
  Customer,
  Invoice,
  Invoice_item,
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
