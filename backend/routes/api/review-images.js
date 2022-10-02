const router = require('express').Router();
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');

router.delete('/:imageId', restoreUser, requireAuth, async (req, res, next) => {
  const reviewImage = await ReviewImage.findByPk(parseInt(req.params.imageId));

  if (!reviewImage) {
    const err = new Error("Review image couldn't be found");
    err.status = 404;
    return next(err);
  }

  const review = await Review.findByPk(reviewImage.reviewId);

  if (req.user.id !== review.userId) {
    return next(requireAuthor());
  }

  await reviewImage.destroy();

  res.json({ message: 'Successfully deleted', statusCode: 200 });
});

module.exports = router;
