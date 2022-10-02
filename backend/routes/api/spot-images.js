const router = require('express').Router();
require('express-async-errors');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

router.delete('/:imageId', restoreUser, requireAuth, async (req, res, next) => {
  const image = await SpotImage.findByPk(parseInt(req.params.imageId));

  if (!image) {
    const err = new Error("Spot Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spot = await Spot.findByPk(image.spotId);

  if (spot.ownerId !== req.user.id) {
    return next(requireAuthor());
  }

  await image.destroy();

  res.json({
    message: 'successfully deleted',
    statusCode: 200,
  });
});

module.exports = router;
