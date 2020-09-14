import Sequelize, { Model } from 'sequelize';

class Point_sale extends Model {
  static init(sequelize) {
    super.init(
      {
        initial_value: Sequelize.DOUBLE,
        flow_value: Sequelize.DOUBLE,
        final_value: Sequelize.DOUBLE,
        closed_at: Sequelize.DATE,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'point_sales',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Cash_register, {
      foreignKey: 'cash_register_id',
      as: 'cash_register',
    });
  }
}

export default Point_sale;
