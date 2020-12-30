module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'stock_moviment', {
      type: Sequelize.BOOLEAN,
      defaltValue: true,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('products', 'stock_moviment');
  },
};
