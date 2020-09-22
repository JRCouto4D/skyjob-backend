import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.INTEGER,
        name: Sequelize.STRING,
        cpf: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        email: Sequelize.STRING,
        telephone: Sequelize.STRING,
        cell_phone: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        wholesale: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'customers',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Customer;
