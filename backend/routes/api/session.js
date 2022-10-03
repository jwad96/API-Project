const express = require('express');
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors,
];
// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  console.log(credential);
  console.log(password);
  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.title = 'Login failed';
    return next(err);
  }

  const token = await setTokenCookie(res, user);

  const { id, firstName, lastName, email, username } = user;

  res.json({
    id,
    firstName,
    lastName,
    email,
    username,
    token,
  });
});

// log out
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'success' });
});
module.exports = router;

// restore session user
router.get('/', restoreUser, requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (user) {
    res.json({
      user,
    });
  } else {
    res.json({});
  }
});
