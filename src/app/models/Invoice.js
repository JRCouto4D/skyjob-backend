import Sequelize, { Model } from 'sequelize';

class Invoice extends Model {
  static init(sequelize) {
    super.init(
      {
        number: Sequelize.STRING,
        date_issue: Sequelize.DATE,
        value: Sequelize.DOUBLE,
        included_at: Sequelize.DATE,
        reversed_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    this.belongsTo(models.Provider, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
  }
}

export default Invoice;
