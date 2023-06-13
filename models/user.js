/*
 * Business schema and data accessor methods
 */

const { ObjectId } = require("mongodb");

const { getDbReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a business object.
 */
const UserSchema = {
  admin: {required: true},
  instructor: {required: true},
  student: {required: true}
};
exports.UserSchema = UserSchema;


/*
 * Executes a DB query to insert a new business into the database.  Returns
 * a Promise that resolves to the ID of the newly-created business entry.
 */
async function insertNewUser(user) {
  user = extractValidFields(user, UserSchema);
  const db = getDbReference();
  const collection = db.collection("users");
  const result = await collection.insertOne(user);
  return result.insertedId;
}
exports.insertNewUser = insertNewUser;

/*
 * Executes a DB query to fetch detailed information about a single
 * specified business based on its ID, including photo data for
 * the business.  Returns a Promise that resolves to an object containing
 * information about the requested business.  If no business with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getBusinessById(id) {
  const db = getDbReference();
  const collection = db.collection("businesses");
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "photos",
            localField: "_id",
            foreignField: "businessId",
            as: "photos",
          },
        },
      ])
      .toArray();
    return results[0];
  }
}
exports.getBusinessById = getBusinessById;

/*
 * Executes a DB query to bulk insert an array new business into the database.
 * Returns a Promise that resolves to a map of the IDs of the newly-created
 * business entries.
 */
async function bulkInsertNewBusinesses(businesses) {
  const businessesToInsert = businesses.map(function (business) {
    return extractValidFields(business, BusinessSchema);
  });
  const db = getDbReference();
  const collection = db.collection("businesses");
  const result = await collection.insertMany(businessesToInsert);
  return result.insertedIds;
}
exports.bulkInsertNewBusinesses = bulkInsertNewBusinesses;
