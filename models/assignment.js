/*
 * assignment schema and data accessor methods
 */

const { ObjectId } = require("mongodb");

const { getDbReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a assignment object.
 */
const AssignmentSchema = {
  title: {required: true},
  dueDate: {required: true}
};
exports.AssignmentSchema = AssignmentSchema;

/*
 * Executes a DB query to return a single page of assignments.  Returns a
 * Promise that resolves to an array containing the fetched page of assignments.
 */
async function getAssignmentsPage(page) {
  const db = getDbReference();
  const collection = db.collection("assignments");
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
    assignments: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
  };
}
exports.getAssignmentsPage = getAssignmentsPage;

/*
 * Executes a DB query to insert a new assignment into the database.  Returns
 * a Promise that resolves to the ID of the newly-created assignment entry.
 */
async function insertNewAssignment(assignment) {
  assignment = extractValidFields(assignment, assignmentSchema);
  const db = getDbReference();
  const collection = db.collection("assignments");
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;

/*
 * Executes a DB query to fetch detailed information about a single
 * specified assignment based on its ID, including photo data for
 * the assignment.  Returns a Promise that resolves to an object containing
 * information about the requested assignment.  If no assignment with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getassignmentById(id) {
}
exports.getassignmentById = getassignmentById;

/*
 * Executes a DB query to bulk insert an array new assignment into the database.
 * Returns a Promise that resolves to a map of the IDs of the newly-created
 * assignment entries.
 */
async function bulkInsertNewassignments(assignments) {
}
exports.bulkInsertNewassignments = bulkInsertNewassignments;
