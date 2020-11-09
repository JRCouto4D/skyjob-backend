module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('itens', 'total', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('itens', 'total');
  },
};
