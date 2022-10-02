const router = require('express').Router();
const { Review } = require('../../db/models');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');

router.delete(
  '/:reviewId',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(parseInt(req.params.reviewId));

    if (!review) {
      const err = new Error("Review couldn't be found");
      err.statusCode = 404;
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
