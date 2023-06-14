/*
 * Business schema and data accessor methods
 */

const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs")

const { getDbReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a business object.
 */
const UserSchema = {
  name: {required: true},
  password: {required: true},
  admin: {required: true},
  instructor: {required: true},
  student: {required: true}
};
exports.UserSchema = UserSchema;

/*
 * Executes a DB query to insert a new business into the database.  Returns
 * a Promise that resolves to the ID of the newly-created business entry.
 */
exports.insertNewUser = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema)

  const hash = await bcrypt.hash(userToInsert.password, 8)
  userToInsert.password = hash
  console.log("  -- userToInsert:", userToInsert)

  const db = getDbReference()
  const collection = db.collection('users')
  const result = await collection.insertOne(userToInsert)
  return result.insertedId
}

/*
 * Fetch a user from the DB based on user ID.
 */
async function getUserById (id, includePassword) {
  const db = getDbReference()
  const collection = db.collection('users')
  if (!ObjectId.isValid(id)) {
      return null
  } else {
      const results = await collection
          .find({ _id: new ObjectId(id) })
          .project(includePassword ? {} : { password: 0 })
          .toArray()
      return results[0]
  }
}
exports.getUserById = getUserById;

exports.validateUser = async function (id, password) {
  const user = await getUserById(id, true)
  return user && await bcrypt.compare(password, user.password)
}