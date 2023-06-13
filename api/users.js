const { Router } = require("express");

const router = Router();

/*
 * Route to list all of a user's businesses.
 */
router.post("/", async function (req, res) {
});

/*
 * Route to list all of a user's reviews.
 */
router.post("/login", async function (req, res) {
});

/*
 * Route to list all of a user's photos.
 */
router.get("/:userId", async function (req, res) {
});

module.exports = router;
