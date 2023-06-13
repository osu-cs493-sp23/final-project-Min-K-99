const { Router } = require("express");
const { connectToDb } = require("../lib/mongo");

const router = Router();

/*
 * Route to return a list of businesses.
 */
router.get("/", async function (req, res) {
});

/*
 * Route to create a new business.
 */
router.post("/", async function (req, res, next) {
});

/*
 * Route to fetch info about a specific business.
 */
router.get("/:courseId", async function (req, res, next) {
});

/*
 * Route to update data for a business.
 */
router.patch("/:courseId", async function (req, res, next) {
});

/*
 * Route to delete a business.
 */
router.get("/:courseId/students", async function (req, res, next) {
});

/*
 * Route to delete a business.
 */
router.post("/:courseId/students", async function (req, res, next) {
});

/*
 * Route to delete a business.
 */
router.get("/:courseId/roster", async function (req, res, next) {
});

/*
 * Route to delete a business.
 */
router.get("/:courseId/assignments", async function (req, res, next) {
});

module.exports = router;
