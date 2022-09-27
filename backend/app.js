const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
}
// DELETE THIS SHIT
app.get('/', async (req, res, next) => {
  const responseObj = {};
  const {
    User,
    Booking,
    Spot,
    SpotImage,
    Review,
    ReviewImage,
  } = require('./db/models');

  responseObj.users = await User.findAll({});
  // responseObj.bookings = await Booking.findAll();
  responseObj.spots = await Spot.findAll();
  responseObj.spotImages = await SpotImage.findAll();
  responseObj.reviews = await Review.findAll();
  responseObj.revImages = await ReviewImage.findAll();

  res.json(responseObj);
});
// DELETE THIS SHIT
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true,
    },
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource not found';
  err.errors = ["The requested resource couldn't be found"];
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
