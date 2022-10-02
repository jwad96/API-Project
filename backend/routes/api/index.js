const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const spotImagesRouter = require('./spot-images');
const reviewImagesRouter = require('./review-images');
const reviewRouter = require('./reviews');
const bookingRouter = require('./bookings');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);

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
