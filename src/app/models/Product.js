import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        cust_price: Sequelize.DOUBLE,
        retail_price: Sequelize.DOUBLE,
        wholesale_price: Sequelize.DOUBLE,
        minimum_wholesale: Sequelize.INTEGER,
        minimum_stock: Sequelize.INTEGER,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    this.belongsTo(models.Provider, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
    this.belongsTo(models.Unit, { foreignKey: 'unit_id', as: 'unit' });
    this.belongsTo(models.File, { foreignKey: 'image_id', as: 'image' });
  }
}

export default Product;
