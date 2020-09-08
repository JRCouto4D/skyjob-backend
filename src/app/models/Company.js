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
        access: Sequelize.BOOLEAN,
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
  }
}

export default Company;
