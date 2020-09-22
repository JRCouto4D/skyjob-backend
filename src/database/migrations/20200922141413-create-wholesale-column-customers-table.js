module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'wholesale', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('customers', 'wholesale');
  },
};
