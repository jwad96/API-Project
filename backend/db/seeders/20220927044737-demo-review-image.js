'use strict';

const reviewImages = [
  {
    id: 1,
    reviewId: 1,
    url: 'exceptionallyshittyhouse.com',
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages', reviewImages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', {
      id: 1,
    });
  },
};
