module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('point_sales', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      cash_register_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cash_registers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      initial_value: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      flow_value: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      final_value: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('point_sales');
  },
};
