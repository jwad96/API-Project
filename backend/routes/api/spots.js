const router = require('express').Router();
const Sequelize = require('sequelize');
const { Spot, Review, User, SpotImage } = require('../../db/models');

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
      [
        Sequelize.fn(
          'ROUND',
          Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
          1
        ),
        'avgRating',
      ],
    ],

    include: {
      model: Review,
      attributes: [],
    },

    group: ['Spot.id'],
  });

  const spotsPreviews = {};

  const previews = await SpotImage.findAll({
    attributes: ['url', 'spotId'],
    where: {
      preview: true,
    },
  });

  previews.forEach((x) => (spotsPreviews[x.spotId] = x.url));

  spots.forEach((spot) => {
    spot.setDataValue('previewImage', spotsPreviews[spot.id]);
  });

  res.json(spots);
});

module.exports = router;
