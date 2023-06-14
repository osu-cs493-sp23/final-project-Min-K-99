/*
 * Business schema and data accessor methods
 */

const { ObjectId } = require("mongodb");

const { getDbReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a business object.
 */
const CourseSchema = {
  description: { required: false },
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true },
};
exports.CourseSchema = CourseSchema;

/*
 * Executes a DB query to return a single page of businesses.  Returns a
 * Promise that resolves to an array containing the fetched page of businesses.
 */
async function getCoursePage(page) {
  const db = getDbReference();
  const collection = db.collection("courses");
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection
    .find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
  };
}
exports.getCoursePage = getCoursePage;

/*
 * Executes a DB query to insert a new business into the database.  Returns
 * a Promise that resolves to the ID of the newly-created business entry.
 */
async function insertNewCourse(course) {
  course = extractValidFields(course, CourseSchema);
  const db = getDbReference();
  const collection = db.collection("courses");
  const result = await collection.insertOne(course);
  return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;

/*
 * Executes a DB query to fetch detailed information about a single
 * specified business based on its ID, including photo data for
 * the business.  Returns a Promise that resolves to an object containing
 * information about the requested business.  If no business with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getCourseById(id) {}
exports.getCourseById = getCourseById;

/*
 * Executes a DB query to bulk insert an array new business into the database.
 * Returns a Promise that resolves to a map of the IDs of the newly-created
 * business entries.
 */
async function bulkInsertNewCourses(courses) {
  const coursesToInsert = courses.map(function (course) {
    return extractValidFields(course, CourseSchema);
  });
  const db = getDbReference();
  const collection = db.collection("courses");
  const result = await collection.insertMany(coursesToInsert);
  return result.insertedIds;
}
exports.bulkInsertNewCourses = bulkInsertNewCourses;
