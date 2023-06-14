const { Router } = require("express");
const { connectToDb } = require("../lib/mongo");
const { validateAgainstSchema } = require("../lib/validation");

const { AssignmentSchema, insertNewAssignment, getAssignmentById } = require("../models/assignment");
const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const router = Router();

/*
 * Route to create a new assignment.
 */
router.post("/", requireAuthentication ,async function (req, res, next) {
    if(validateAgainstSchema(req.body, AssignmentSchema)){
        try{
            const id = await insertNewAssignment(req.body)
            res.status(201).send({
                _id: id
            })
        } catch (e) {
            next(e)
        }
    } else {
        res.status(400).send({
            error: "Requested body does not contain a valid Assignment."
        })
    }
});

/*
 * Route to fetch info about a specific photo.
 */
router.get("/:assignmentId", async function (req, res, next) {
    try{
        const assignment = await getAssignmentById(req.params.assignmentId)
        if(assignment){
            res.status(200).send({
                assignment : assignment
            })
        } else {
            next()
        }
    } catch (e) {
        next (e)
    }
});

/*
 * Route to update an assignment based on assignmentId
 */
router.patch("/:assignmentId", async function (req, res, next) {
});

/*
 * Route to delete an assignment based on assignmentId
 */
router.delete("/:assignmentId", async function (req, res, next) {
});

/*
 * Route to delete an assignment.
 */
router.get("/:assignmentId/submissions", async function (req, res, next) {
});

/*
 * Route to delete a photo.
 */
router.post("/:assignmentId/submissions", async function (req, res, next) {
});

module.exports = router;
