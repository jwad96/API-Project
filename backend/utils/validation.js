const { validationResult, check, body } = require('express-validator');

const validateSpot = [
  body('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  body('city').exists({ checkFalsy: true }).withMessage('City is required'),
  body('state').exists({ checkFalsy: true }).withMessage('State is required'),
  body('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  body('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .toFloat()
    .withMessage('Latitude is not valid'),
  body('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .toFloat()
    .withMessage('Longitude is not valid'),
  body('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  body('price')
    .exists({ checkFalsy: true })
    .isFloat()
    .toFloat()
    .withMessage('Price per day is required'),
];

const validateSpotEdit = [
  body('address')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  body('city')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  body('state')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  body('country')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  body('lat')
    .optional()
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .toFloat()
    .withMessage('Latitude is not valid'),
  body('lng')
    .optional()
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .toFloat()
    .withMessage('Longitude is not valid'),
  body('name')
    .optional()
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  body('price')
    .optional()
    .exists({ checkFalsy: true })
    .isFloat()
    .toFloat()
    .withMessage('Price per day is required'),
];

const validateReview = [
  body('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  body('stars')
    .exists()
    .isInt({ min: 1, max: 5 })
    .toInt()
    .withMessage('Stars must be an integer from 1 to 5'),
];

const validateBookingDate = [
  body('startDate').isDate(),
  body('endDate')
    .isDate()
    .custom((endDate, { req }) => {
      if (req.body.startDate >= endDate) {
        return false;
      }
      return true;
    })
    .withMessage('endDate cannot be on or before startDate'),
];

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.errors.reduce((acc, err) => {
      acc[err.param] = err.msg;
      return acc;
    }, {});

    const err = Error('Validation error');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad Request.';
    next(err);
  }

  next();
};

module.exports = {
  validateBookingDate,
  validateReview,
  validateSpot,
  validateSpotEdit,
  handleValidationErrors,
};
