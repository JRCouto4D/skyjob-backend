import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Company extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        avatar_id: Sequelize.INTEGER,
        access: Sequelize.BOOLEAN,
        admin: Sequelize.BOOLEAN,
        current_contract: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'companies',
      }
    );

    this.addHook('beforeSave', async (company) => {
      if (company.password) {
        company.password_hash = await bcrypt.hash(company.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsTo(models.Contract, {
      foreignKey: 'current_contract',
      as: 'contract',
    });
  }
}

export default Company;
