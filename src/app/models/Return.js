import Sequelize, { Model } from 'sequelize';

class Return extends Model {
  static init(sequelize) {
    super.init(
      {
        sale_id: Sequelize.INTEGER,
        point_sale_id: Sequelize.INTEGER,
        authorized_id: Sequelize.INTEGER,
        company_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'returns',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Sale, { foreignKey: 'sale_id', as: 'sale' });
    this.belongsTo(models.Point_sale, {
      foreignKey: 'point_sale_id',
      as: 'point_sale',
    });
    this.belongsTo(models.User, {
      foreignKey: 'authorized_id',
      as: 'authorized',
    });
    this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  }
}

export default Return;
