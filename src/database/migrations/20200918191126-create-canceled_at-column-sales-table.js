module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'canceled_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('sales', 'canceled_at');
  },
};
