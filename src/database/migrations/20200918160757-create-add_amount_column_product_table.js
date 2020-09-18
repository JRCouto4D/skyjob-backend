module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'amount_stock', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('products', 'amount_stock');
  },
};
