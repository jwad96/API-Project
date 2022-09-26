'use strict';

const spots = [
  {
    ownerId: 1,
    address: '208 Tyler St',
    city: 'patterson',
    state: 'CA',
    country: 'USA',
    lat: 0,
    lng: 0,
    name: 'demo-house',
    description: 'the best',
    price: 9.99,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', spots, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', {
      ownerId: 1,
    });
  },
};
