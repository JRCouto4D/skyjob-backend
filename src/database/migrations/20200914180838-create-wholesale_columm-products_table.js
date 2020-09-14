module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'wholesale', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('products', 'wholesale');
  },
};
