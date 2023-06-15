const { Router } = require("express");
const { connectToDb } = require("../lib/mongo");

const { generateAuthToken, requireAuthentication } = require("../lib/auth");

const {
  UserSchema,
  insertNewUser,
  getUserById,
  getUserByEmail,
  validateUser,
  getUserIdManual,
} = require("../models/user");

const {
  getCoursePage,
  insertNewCourse,
  CourseSchema,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  insertNewStudentToCourse,
  deleteStudentFromCourse,
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
router.post("/", requireAuthentication, async function (req, res, next) {
  //Check the role of user based on token
  const user = await getUserById(req.user);

  if (user.role === "admin") {
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
  } else {
    res.status(403).send({
      error: "Need to be admin to post course.",
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
router.patch(
  "/:courseId",
  requireAuthentication,
  async function (req, res, next) {
    //check user role based on token
    const user = await getUserById(req.user);
    const idCheck = await getCourseById(req.params.courseId);

    if (
      user.role === "admin" ||
      (user.role === "instructor" &&
        user._id.toString() === idCheck.instructorId)
    ) {
      try {
        const result = await updateCourseById(req.params.courseId, req.body);
        res.status(200).send(`Your data is modified`);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).send({
        error:
          "Need to be either admin or instructor of the course to patch course information.",
      });
    }
  }
);

/*
 * Route to delete info about a specific course.
 */
router.delete(
  "/:courseId",
  requireAuthentication,
  async function (req, res, next) {
    //Check user role based on token
    const user = await getUserById(req.user);
    if (user.role === "admin") {
      try {
        const course = await deleteCourseById(req.params.courseId);
        res.status(200).send(`Your data is deleted`);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).send({
        error: "Need to be admin to delete courses.",
      });
    }
  }
);

/*
 * Route to delete a course.
 */
router.get(
  "/:courseId/students",
  requireAuthentication,
  async function (req, res, next) {
    //check user role based on token
    const user = await getUserById(req.user);
    const idCheck = await getCourseById(req.params.courseId);

    if (
      user.role === "admin" ||
      (user.role === "instructor" &&
        user._id.toString() === idCheck.instructorId)
    ) {
      try {
        const course = await getCourseById(req.params.courseId);
        if (course.student) {
            const student = {
                student: course.student
            };
          res.status(200).send(student);
        } else {
          next();
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).send({
        error:
          "Need to be either admin or instructor of the course to access the student information.",
      });
    }
  }
);

/*
 * Route to post a student.
 */
router.post("/:courseId/students", async function (req, res, next) {
  //Check the role of user based on token
  const user = await getUserById(req.user, true);

  if (true) {
    try {
      await insertNewStudentToCourse(req.params.courseId, req.body.add);
      await deleteStudentFromCourse(req.params.courseId, req.body.remove);
      res.status(201).send("Students added and removed from course");
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).send({
      error: "Need to be admin to post course.",
    });
  }
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
