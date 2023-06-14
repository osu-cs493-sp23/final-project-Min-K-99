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
  courseId: {required: true},
  title: {required: true},
  points: {required: true},
  due: {required: true}
};
exports.AssignmentSchema = AssignmentSchema;

/*
 * Insert new assignment into `assignments` collection
 */
exports.insertNewAssignment = async function (assignment) {
  const assignmentToInsert = extractValidFields(assignment, AssignmentSchema)

  const db = getDbReference()
  const collection = db.collection('assignments')
  const result = await collection.insertOne(assignmentToInsert)
  
  return result.insertedId
}

/*
 * Executes a DB query to fetch detailed information about a single
 * specified assignment based on its ID, including photo data for
 * the assignment.  Returns a Promise that resolves to an object containing
 * information about the requested assignment.  If no assignment with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getAssignmentById(id) {
  const db = getDbReference()
  const collection = db.collection('assignments')

  if(!ObjectId.isValid(id)){
    return null
  } else {
    const results = await collection
      .find({_id: new ObjectId(id)})
      .toArray()
    
    return results[0]
  }
}
exports.getAssignmentById = getAssignmentById;

/*
 * Not yet working Patch Endpoint
 */
async function updateAssignmentById(id){
  // const db = getDbReference()
  // const collection = db.collection('assignments')

  // if(!ObjectId.isValid(id)){
  //   return null
  // } else {
  //   const results = await collection.up
  // }
}