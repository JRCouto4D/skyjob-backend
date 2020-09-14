import Sequelize, { Model } from 'sequelize';

class Cash_register extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'cash_registers',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  }
}

export default Cash_register;
