import Sequelize, { Model } from 'sequelize';

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        discount: Sequelize.DOUBLE,
        total: Sequelize.DOUBLE,
      },
      {
        sequelize,
        tableName: 'itens',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Sale, { foreignKey: 'sale_id', as: 'sale' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default Item;
