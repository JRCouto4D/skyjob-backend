import Sequelize, { Model } from 'sequelize';

class Bleed extends Model {
  static init(sequelize) {
    super.init(
      {
        cash_value: Sequelize.DOUBLE,
      },
      {
        sequelize,
        tableName: 'bleeds',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Point_sale, {
      foreignKey: 'point_sale_id',
      as: 'point_sale',
    });
  }
}

export default Bleed;
