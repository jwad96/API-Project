const router = require('express').Router();
const { Review, ReviewImage, User, Spot } = require('../../db/models');
const { restoreUser, requireAuth, requireAuthor } = require('../../utils/auth');
const {
  validateReview,
  validateUrl,
  handleValidationErrors,
} = require('../../utils/validation');
const Sequelize = require('sequelize');

router.put(
  '/:reviewId',
  restoreUser,
  requireAuth,
  validateReview,
  handleValidationErrors,
  async (req, res, next) => {
    const reviewToEdit = await Review.findByPk(parseInt(req.params.reviewId));

    if (!reviewToEdit) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (reviewToEdit.userId !== req.user.id) {
      return next(requireAuthor());
    }

    const { review, stars } = req.body;
    reviewToEdit.review = review;
    reviewToEdit.stars = stars;

    await reviewToEdit.save();

    res.json(reviewToEdit);
  }
);

router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },

    include: [
      {
        model: User,
        as: 'reviewingUser',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Spot,
        as: 'reviewedSpot',
        attributes: [
          'id',
          'ownerId',
          'address',
          'city',
          'state',
          'country',
          'lat',
          'lng',
          'name',
          'price',
          [
            Sequelize.literal(
              `(SELECT "url" FROM "SpotImages" JOIN "Spots" ON "SpotImages"."spotId"="User"."id" WHERE preview=true LIMIT 1)`
            ),
            'User',
          ],
        ],
      },
      { model: ReviewImage, as: 'ReviewImages', attributes: ['id', 'url'] },
    ],
  });

  const reviewCollection = { Reviews: [] };

  for (let reviewElem of reviews) {
    const {
      id,
      userId,
      spotId,
      review,
      stars,
      createdAt,
      updatedAt,
      reviewingUser,
      reviewedSpot,
      ReviewImages,
    } = reviewElem;

    reviewCollection['Reviews'].push({
      id,
      userId,
      spotId,
      review,
      stars,
      createdAt,
      updatedAt,
      User: reviewingUser,
      Spot: reviewedSpot,
      ReviewImages,
    });
  }

  res.json(reviewCollection);
});

router.post(
  '/:reviewId/images',
  restoreUser,
  requireAuth,
  validateUrl,
  handleValidationErrors,
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
