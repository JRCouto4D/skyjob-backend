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
  }
}

export default Sale;
