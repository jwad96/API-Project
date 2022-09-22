const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const sessionRouter = require('./session');
const usersRouter = require('./users');
const { User } = require('../../db/models');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

// router.get('/require-auth', requireAuth, (req, res) => {
//   res.json(req.user);
// });

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'test-username',
//     },
//   });

//   setTokenCookie(res, user);
//   res.json({ user });
// });

// router.get('/restore-user', (req, res) => {
//   res.json(req.user);
// });

router.post('/test', (req, res, next) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
