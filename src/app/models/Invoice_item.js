import Sequelize, { Model } from 'sequelize';

class Invoice_item extends Model {
  static init(sequelize) {
    super.init(
      {
        price: Sequelize.DOUBLE,
        amount: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default Invoice_item;
