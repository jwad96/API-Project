const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  Spot,
  Review,
  User,
  SpotImage,
  ReviewImage,
} = require('../../db/models');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateQueryParams = [
  query('page').default('1'),
  query('size').default('20'),
  check('page')
    .isInt({ min: 1, max: 10 })
    .toInt()
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .isInt({ min: 1, max: 20 })
    .toInt()
    .withMessage('Size must be greater than or equal to 1'),
  check('minLat')
    .optional()
    .isFloat()
    .toFloat()
    .withMessage('Minimum latitude is invalid'),
  check('maxLat')
    .optional()
    .isFloat()
    .toFloat()
    .withMessage('Maximum latitude is invalid'),
  check('minLng')
    .optional()
    .isFloat()
    .toFloat()
    .withMessage('Minimum longitude is invalid'),
  check('maxLng')
    .optional()
    .isFloat()
    .toFloat()
    .withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors,
];

const minMaxQueryContructor = (where, name, queryParam, option) => {
  if (queryParam) {
    where[name] = where[name] || {};
  }

  if (queryParam && option === 'min') {
    where[name][Op.gte] = queryParam;
  }
  if (queryParam && option === 'max') {
    where[name][Op.lte] = queryParam;
  }
};

router.get('/', validateQueryParams, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const where = {};

  minLat = minMaxQueryContructor(where, 'lat', minLat, 'min');
  maxLat = minMaxQueryContructor(where, 'lat', maxLat, 'max');
  minLng = minMaxQueryContructor(where, 'lng', minLng, 'min');
  maxLng = minMaxQueryContructor(where, 'lng', maxLng, 'max');
  minPrice = minMaxQueryContructor(where, 'price', minPrice, 'min');
  maxPrice = minMaxQueryContructor(where, 'price', maxPrice, 'max');

  const Spots = await Spot.findAll({
    where,
    limit: size,
    offset: (page - 1) * size,
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
      duplicating: false,
      //   required: true,
    },

    group: ['Spot.id'],
    subQuery: false,
  });

  const spotsPreviews = {};

  const previews = await SpotImage.findAll({
    attributes: ['url', 'spotId'],
    where: {
      preview: true,
    },
  });

  previews.forEach((x) => (spotsPreviews[x.spotId] = x.url));

  Spots.forEach((spot) => {
    spot.setDataValue('previewImage', spotsPreviews[spot.id]);
  });

  res.json({ Spots, page, size });
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

  // Error handling
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  }
  // Error handling end

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

router.get('/:spotId/reviews', async (req, res, next) => {
  const spot = await Spot.findByPk(parseInt(req.params.spotId));

  const Reviews = await Review.findAll({
    attributes: [
      'id',
      'spotId',
      'userId',
      'review',
      'stars',
      'createdAt',
      'updatedAt',
    ],
    where: {
      spotId: parseInt(req.params.spotId),
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        as: 'ReviewImages',
        attributes: ['id', 'url'],
      },
    ],
  });

  if (!spot) {
    const err = new Error("Couldn't find a spot with the specified id");
    err.status = 404;
    next(err);
  } else {
    res.json({ Reviews });
  }
});

module.exports = router;
