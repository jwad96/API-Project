const router = require('express').Router();
const { Booking, Spot } = require('../../db/models');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');
const Sequelize = require('sequelize');

router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
  const userBookings = await Booking.findAll({
    attributes: [
      'id',
      'spotId',
      'userId',
      'startDate',
      'endDate',
      'createdAt',
      'updatedAt',
    ],

    where: {
      userId: req.user.id,
    },

    include: {
      model: Spot,
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
        'price',
        [
          Sequelize.literal(
            `(SELECT "url" FROM "SpotImages" JOIN "Spots" ON "SpotImages"."spotId"="Spot"."id" WHERE preview=true LIMIT 1)`
          ),
          'previewImage',
        ],
      ],
    },
  });

  const bookings = { Bookings: [] };
  for (let booking of userBookings) {
    const {
      id,
      spotId,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      Spot,
    } = booking;

    bookings['Bookings'].push({
      id,
      spotId,
      Spot,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    });
  }

  res.json(bookings);
});

module.exports = router;
