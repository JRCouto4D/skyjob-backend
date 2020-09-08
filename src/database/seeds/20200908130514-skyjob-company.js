const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('companies', [
      {
        description: 'Skyjob Company',
        email: 'skyjob@email.com',
        password_hash: bcrypt.hashSync('123456', 8),
        access: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
