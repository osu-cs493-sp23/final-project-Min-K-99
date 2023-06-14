const { Router } = require("express");
const { connectToDb } = require("../lib/mongo");

const {
  getCoursePage,
  insertNewCourse,
  CourseSchema,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} = require("../models/course");
const {
  extractValidFields,
  validateAgainstSchema,
} = require("../lib/validation");

const router = Router();

/*
 * Route to return a list of courses.
 */
router.get("/", async function (req, res, next) {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getCoursePage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = "/courses?page=1";
    }
    res.status(200).send(coursePage);
  } catch (err) {
    next(err);
  }
});

/*
 * Route to create a new course.
 */
router.post("/", async function (req, res, next) {
  if (validateAgainstSchema(req.body, CourseSchema)) {
    try {
      const id = await insertNewCourse(req.body);
      res.status(201).send({
        id: id,
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid course object.",
    });
  }
});

/*
 * Route to fetch info about a specific course.
 */
router.get("/:courseId", async function (req, res, next) {
  try {
    const course = await getCourseById(req.params.courseId);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

/*
 * Route to update data for a course.
 */
router.patch("/:courseId", async function (req, res, next) {
  try {
    const result = await updateCourseById(req.params.courseId, req.body);
    res.status(200).send(`Your data is modified`);
  } catch (err) {
    next(err);
  }
});

/*
 * Route to delete info about a specific course.
 */
router.delete("/:courseId", async function (req, res, next) {
  try {
    const course = await deleteCourseById(req.params.courseId);
    res.status(200).send(`Your data is deleted`);
  } catch (err) {
    next(err);
  }
});

/*
 * Route to delete a course.
 */
router.get("/:courseId/students", async function (req, res, next) {
    try {
      const course = await getCourseById(req.params.courseId);
      if (course) {
        res.status(200).send(course);
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
});

/*
 * Route to delete a course.
 */
router.post("/:courseId/students", async function (req, res, next) {

});

/*
 * Route to delete a course.
 */
router.get("/:courseId/roster", async function (req, res, next) {});

/*
 * Route to delete a course.
 */
router.get("/:courseId/assignments", async function (req, res, next) {});

module.exports = router;
