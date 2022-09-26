'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'testemail@gmail.com',
          username: 'Demo-lition',
          firstName: 'Demo',
          lastName: 'lition',
          hashedPassword: bcrypt.hashSync('password'),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      'Users',
      {
        username: {
          [Op.eq]: 'Demo-lition',
        },
      },
      {}
    );
  },
};
