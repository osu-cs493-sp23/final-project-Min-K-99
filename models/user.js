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
  email: {required: true},
  password: {required: true},
  role: {required: true}
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

async function getUserByEmail(email, includePassword){
  const db = getDbReference()
  const collection = db.collection('users')
  
  const results = await collection
    .find({ email: email })
    .project(includePassword ? {} : { password: 0 })
    .toArray()
  console.log("==results[0]:", results[0])
  return results[0]
}
exports.getUserByEmail = getUserByEmail;

exports.validateUser = async function (email, password) {
  const user = await getUserByEmail(email, true)
  return user && await bcrypt.compare(password, user.password)
}

exports.getUserIdManual = async function(email, password){
  const user = await getUserByEmail(email, true)
  console.log("==user.id:", user._id.toString())
  return user._id.toString()
}