const router = require('express').Router();
const Sequelize = require('sequelize');
const { Spot, Review, User, SpotImage } = require('../../db/models');

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    where: {
      id: 1,
    },
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

router.get('/:spotId', async (req, res, next) => {
  const spot = await Spot.findByPk(parseInt(req.params.spotId), {
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
      [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating'],
    ],

    include: [
      {
        model: Review,
        attributes: [],
      },
    ],
    group: ['Spot.id'],
  });

  const spotImagesOwner = await Spot.findByPk(parseInt(req.params.spotId), {
    attributes: [],
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        as: 'Owner',
      },
    ],
  });

  spot.setDataValue('SpotImages', spotImagesOwner.SpotImages);
  spot.setDataValue('Owner', spotImagesOwner.Owner);

  res.json(spot);
});

module.exports = router;
