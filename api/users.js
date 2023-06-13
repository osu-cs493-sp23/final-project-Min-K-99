const { Router } = require("express");

const { Business } = require("../models/assignment");
const { Photo } = require("../models/course");
const { Review } = require("../models/user");

const router = Router();

/*
 * Route to list all of a user's businesses.
 */
router.post("/", async function (req, res) {
  const userId = req.params.userId;
  try {
    const userBusinesses = await Business.findAll({
      where: { ownerId: userId },
    });
    res.status(200).json({
      businesses: userBusinesses,
    });
  } catch (e) {
    next(e);
  }
});

/*
 * Route to list all of a user's reviews.
 */
router.post("/login", async function (req, res) {
  const userId = req.params.userId;
  try {
    const userReviews = await Review.findAll({ where: { userId: userId } });
    res.status(200).json({
      reviews: userReviews,
    });
  } catch (e) {
    next(e);
  }
});

/*
 * Route to list all of a user's photos.
 */
router.get("/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const userPhotos = await Photo.findAll({ where: { userId: userId } });
    res.status(200).json({
      photos: userPhotos,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
