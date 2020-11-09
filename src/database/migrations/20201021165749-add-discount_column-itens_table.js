module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('itens', 'discount', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('itens', 'discount');
  },
};
