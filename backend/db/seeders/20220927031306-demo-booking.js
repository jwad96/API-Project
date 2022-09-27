'use strict';

const bookings = [
  {
    id: 1,
    spotId: 1,
    userId: 1,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert('Bookings', bookings);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Bookings', {
      id: 1,
    });
  },
};
