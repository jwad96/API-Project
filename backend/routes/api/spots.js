const router = require('express').Router();
const Sequelize = require('sequelize');
const { Spot, Review, User } = require('../../db/models');

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
      //   [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
    ],

    include: {
      model: Review,
      attributes: [],
    },
  });

  spots.forEach((spot) => {
    console.log(spot);
    spot.dataValues.previewImage = 'image url';
  });

  res.json(spots);
});

module.exports = router;
