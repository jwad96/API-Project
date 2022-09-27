'use strict';

const reviews = [
  {
    id: 1,
    spotId: 1,
    userId: 1,
    review: 'this place blows',
    stars: 0,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', reviews);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', {
      id: 1,
    });
  },
};
