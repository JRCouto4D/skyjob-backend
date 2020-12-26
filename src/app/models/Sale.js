import Sequelize, { Model } from 'sequelize';

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        type_sale: Sequelize.INTEGER,
        payment: Sequelize.INTEGER,
        installments: Sequelize.INTEGER,
        total: Sequelize.DOUBLE,
        complete_at: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        company_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Point_sale, {
      foreignKey: 'point_sale_id',
      as: 'point_sale',
    });
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company',
    });
  }
}

export default Sale;
