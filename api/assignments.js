const { Router } = require("express");
const { connectToDb } = require("../lib/mongo");

const router = Router();

/*
 * Route to create a new photo.
 */
router.post("/", async function (req, res, next) {
});

/*
 * Route to fetch info about a specific photo.
 */
router.get("/:assignmentId", async function (req, res, next) {
});

/*
 * Route to update a photo.
 */
router.patch("/:assignmentId", async function (req, res, next) {
});

/*
 * Route to delete a photo.
 */
router.delete("/:assignmentId", async function (req, res, next) {
});

/*
 * Route to delete a photo.
 */
router.get("/:assignmentId/submissions", async function (req, res, next) {
});

/*
 * Route to delete a photo.
 */
router.post("/:assignmentId/submissions", async function (req, res, next) {
});

module.exports = router;
