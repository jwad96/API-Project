const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
  Spot,
  Review,
  User,
  SpotImage,
  ReviewImage,
  Booking,
} = require('../../db/models');
const { check, query } = require('express-validator');
const {
  handleValidationErrors,
  validateBookingDate,
  validateReview,
  validateSpot,
  validateSpotEdit,
} = require('../../utils/validation');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');

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

router.get(
  '/:spotId/bookings',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const bookings = await Booking.findAll({
      where: {
        spotId: parseInt(req.params.spotId),
      },

      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
    });

    const bookingsCollection = { Bookings: [] };

    for (let booking of bookings) {
      const {
        User,
        id,
        spotId,
        userId,
        startDate,
        endDate,
        createdAt,
        updatedAt,
      } = booking;
      if (spot.ownerId === req.user.id) {
        bookingsCollection['Bookings'].push({
          User,
          id,
          spotId,
          userId,
          startDate,
          endDate,
          createdAt,
          updatedAt,
        });
      } else {
        bookingsCollection['Bookings'].push({
          spotId,
          startDate,
          endDate,
        });
      }
    }

    res.json(bookingsCollection);
  }
);

router.post(
  '/:spotId/reviews',
  restoreUser,
  requireAuth,
  validateReview,
  handleValidationErrors,
  async (req, res, next) => {
    const spotExists = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spotExists) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const reviewExists = await Review.findOne({
      where: {
        spotId: parseInt(req.params.spotId),
        userId: req.user.id,
      },
    });

    if (reviewExists) {
      const err = new Error('User already has a review for this spot');
      err.status = 403;
      return next(err);
    }

    const { stars, review } = req.body;

    const createdReview = await req.user.createUserReview({
      userId: req.user.id,
      spotId: parseInt(req.params.spotId),
      review,
      stars,
    });

    res.json(createdReview);
  }
);

router.delete('/:spotId', restoreUser, requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(parseInt(req.params.spotId));

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    return next(requireAuthor());
  }

  await spot.destroy();

  res.json({
    message: 'Successfully deleted',
    statusCode: 200,
  });
});

router.put(
  '/:spotId',
  restoreUser,
  requireAuth,
  validateSpotEdit,
  handleValidationErrors,
  async (req, res, next) => {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (spot.ownerId !== req.user.id) {
      return next(requireAuthor());
    }

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.json(spot);
  }
);

router.post(
  '/:spotId/images',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (spot.ownerId !== req.user.id) {
      return next(requireAuthor());
    }

    const newSpotImage = await spot.createSpotImage({
      url: req.body.url,
      preview: req.body.preview,
    });

    const { id, url, preview } = newSpotImage;

    res.json({ id, url, preview });
  }
);

router.post(
  '/:spotId/bookings',
  restoreUser,
  requireAuth,
  validateBookingDate,
  handleValidationErrors,
  async (req, res, next) => {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (req.user.id === spot.ownerId) {
      return next(requireAuthor());
    }

    const { startDate, endDate } = req.body;

    const conflictingBookings = await Booking.findAll({
      where: {
        [Op.or]: {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      },
    });

    const err = new Error(
      'Sorry, this spot is already booked for the specified dates'
    );
    err.status = 403;
    err.errors = {};

    for (let booking of conflictingBookings) {
      if (booking.startDate <= startDate && startDate <= booking.endDate) {
        err.errors.startDate = 'Start date conflicts with an existing booking';
      }

      if (booking.startDate <= endDate && endDate <= booking.endDate) {
        err.errors.endDate = 'End date conflicts with an existing booking';
      }
    }

    if (Object.values(err.errors).length > 0) {
      return next(err);
    }

    const newBooking = await Booking.create({
      spotId: parseInt(req.params.spotId),
      userId: req.user.id,
      startDate,
      endDate,
    });

    res.json(newBooking.toJSON());
  }
);

router.post(
  '/',
  restoreUser,
  requireAuth,
  validateSpot,
  handleValidationErrors,
  async (req, res, next) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.json(newSpot);
  }
);

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
          Sequelize.fn('AVG', Sequelize.col('spotReview.stars')),
          1
        ),
        'avgRating',
      ],
    ],

    include: {
      model: Review,
      attributes: [],
      duplicating: false,
      as: 'spotReview',
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

router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
  const Spots = await Spot.findAll({
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
          Sequelize.fn('AVG', Sequelize.col('spotReview.stars')),
          1
        ),
        'avgRating',
      ],
      [
        Sequelize.literal(
          `(SELECT "url" FROM "SpotImages" JOIN "Spots" ON "SpotImages"."spotId"="Spot"."id" WHERE preview=true LIMIT 1)`
        ),
        'previewImage',
      ],
    ],

    include: [
      {
        model: Review,
        attributes: [],
        as: 'spotReview',
      },
    ],

    where: {
      ownerId: req.user.id,
    },

    group: ['Spot.id'],
  });

  res.json({ Spots });
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
      [Sequelize.fn('COUNT', Sequelize.col('spotReview.id')), 'numReviews'],
      [Sequelize.fn('AVG', Sequelize.col('spotReview.stars')), 'avgStarRating'],
    ],

    include: [
      {
        model: Review,
        attributes: [],
        as: 'spotReview',
      },
    ],
    group: ['Spot.id'],
  });

  // Error handling
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
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
        as: 'User',
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
    return next(err);
  } else {
    res.json({ Reviews });
  }
});

module.exports = router;
