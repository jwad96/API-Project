const router = require('express').Router();
const { Review, ReviewImage } = require('../../db/models');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');

router.post(
  '/:reviewId/images',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(parseInt(req.params.reviewId));

    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (review.userId !== req.user.id) {
      return next(requireAuthor());
    }

    const reviewImages = await ReviewImage.findAll({
      where: { reviewId: parseInt(req.params.reviewId) },
    });

    if (reviewImages.length >= 10) {
      const err = new Error(
        'Maximum number of images for this resource was reached'
      );
      err.status = 403;
      return next(err);
    }

    const reviewImage = await review.createReviewImage({
      url: req.body.url,
    });

    const { id, url } = reviewImage;

    res.json({ id, url });
  }
);

router.delete(
  '/:reviewId',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(parseInt(req.params.reviewId));

    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (review.userId !== req.user.id) {
      return next(requireAuthor());
    }

    await review.destroy();

    res.json({ message: 'Successfully deleted', statusCode: 200 });
  }
);

module.exports = router;
