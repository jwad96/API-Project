const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('lastName is required'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage(
      'Please provide a username with at least 4 characters and at most 30'
    ),
  check('username').not().isEmail().withMessage('Username cannot be an email'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors,
];

router.post('/', validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, password, username } = req.body;

  const existingUsername = await User.findOne({
    where: {
      username,
    },
  });

  const existingEmail = await User.findOne({
    where: {
      email,
    },
  });

  // ERROR HANDLING
  let err;
  const errors = {};

  if (existingUsername || existingEmail) {
    err = new Error('User already exists');
    err.status = 403;
  }

  if (existingUsername) {
    errors.username = 'User with that username already exists';
  }

  if (existingEmail) {
    errors.email = 'User with that email already exists';
  }

  if (err) {
    err.errors = errors;
    return next(err);
  }
  // ERROR HANDLING END

  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  await setTokenCookie(res, user);

  return res.json({
    id: user.id,
    firstName,
    lastName,
    email,
    username,
    token: req.cookies.token,
  });
});

module.exports = router;
