module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'company_id', {
      type: Sequelize.INTEGER,
      references: { model: 'companies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('sales', 'company_id');
  },
};
