'use strict';

const images = [
  {
    id: 1,
    spotId: 1,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', images);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', {
      id: 1,
    });
  },
};
