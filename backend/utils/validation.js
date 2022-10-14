const { validationResult, check, body, query } = require('express-validator');

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
  body('startDate').isDate().withMessage('Date must be YYYY-MM-DD'),
  body('endDate')
    .isDate()
    .custom((endDate, { req }) => {
      if (Date.parse(req.body.startDate) >= Date.parse(endDate)) {
        return false;
      }
      return true;
    })
    .withMessage('endDate cannot be on or before startDate'),
];

const validateUrl = [body('url').exists({ checkFalsy: true })];

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
  validateQueryParams,
  validateSpot,
  validateSpotEdit,
  validateUrl,
  handleValidationErrors,
};
