const { validationResult } = require('express-validator');

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
  handleValidationErrors,
};
