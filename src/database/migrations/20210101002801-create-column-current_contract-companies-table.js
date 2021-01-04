module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('companies', 'current_contract', {
      type: Sequelize.INTEGER,
      references: { model: 'contracts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('companies', 'current_contract');
  },
};
