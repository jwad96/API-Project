const router = require('express').Router();
const { Booking, Spot } = require('../../db/models');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');
const Sequelize = require('sequelize');
const {
  validateBookingDate,
  handleValidationErrors,
} = require('../../utils/validation');

router.put(
  '/:bookingId',
  restoreUser,
  requireAuth,
  validateBookingDate,
  handleValidationErrors,
  async (req, res, next) => {
    const booking = await Booking.findByPk(parseInt(req.params.bookingId));

    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (booking.userId !== req.user.id) {
      return next(requireAuthor());
    }

    const now = Date.now();
    const bookingEnd = Date.parse(booking.endDate);

    if (bookingEnd < now) {
      const err = new Error("Past bookings can't be modified");
      err.status = 403;
      return next(err);
    }

    const bookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
      },
    });

    const { startDate, endDate } = req.body;
    const err = new Error(
      'Sorry, this spot is already booked for the specific dates'
    );
    err.status = 403;
    err.errors = {};

    for (let bookingElem of bookings) {
      if (
        bookingElem.startDate <= startDate &&
        startDate <= bookingElem.endDate &&
        bookingElem.id !== booking.id
      ) {
        err.errors.startDate = 'Start date conflicts with an existing booking';
      }

      if (
        bookingElem.startDate <= endDate &&
        endDate <= bookingElem.endDate &&
        bookingElem.id !== booking.id
      ) {
        err.errors.endDate = 'End date conflicts with an existing booking';
      }
    }

    if (Object.values(err.errors).length > 0) {
      return next(err);
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.json(booking);
  }
);

router.delete(
  '/:bookingId',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const booking = await Booking.findByPk(parseInt(req.params.bookingId));

    if (!booking) {
      const err = new Error("Couldn't find booking");
      err.status = 404;
      return next(err);
    }

    const spot = await Spot.findByPk(booking.spotId);

    if (booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
      return next(requireAuthor());
    }

    await booking.destroy();

    res.json({ message: 'Successfully deleted', statusCode: 200 });
  }
);

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
