const { Router } = require("express");
const { getDbReference } = require("../lib/mongo");
const { validateAgainstSchema } = require("../lib/validation");

const { AssignmentSchema, SubmissionSchema, insertNewAssignment, insertNewSubmission, getAssignmentById, getSubmissionById, deleteAssignmentById } = require("../models/assignment");
const { UserSchema, insertNewUser, getUserById, getUserByEmail, validateUser, getUserIdManual } = require('../models/user')

const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const { ObjectId } = require("bson");
const router = Router();

/*
 * Route to create a new assignment.
 */
router.post("/", requireAuthentication, async function (req, res, next) {

    //Check the role of user based on token
    const user = await getUserById(req.user)
    
    if(user.role === "instructor" || user.role === "admin"){
        if(validateAgainstSchema(req.body, AssignmentSchema)){
            try{
                const id = await insertNewAssignment(req.body)
                res.status(201).send({
                    id: id
                })
            } catch (e) {
                next(e)
            }
        } else {
            res.status(400).send({
                error: "Requested body does not contain a valid Assignment."
            })
        }
    } else {
        res.status(403).send({
            error: "Unable to access the specificed resource."
        })
    }
});

/*
 * Route to fetch info about a specific photo.
 */
router.get("/:assignmentId", requireAuthentication, async function (req, res, next) {
    try{
        const assignment = await getAssignmentById(req.params.assignmentId)
        if(assignment){
            res.status(200).send({
                courseId : assignment.courseId,
                title : assignment.title,
                poitns: assignment.points,
                due: assignment.due
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
router.patch("/:assignmentId", requireAuthentication, async function (req, res, next) {
});

/*
 * Route to delete an assignment based on assignmentId
 */
router.delete("/:assignmentId", requireAuthentication, async function (req, res, next) {
    try{
        const assignment = await deleteAssignmentById(req.params.assignmentId)
        if(assignment){
            res.status(200).send({
                msg: "SUCCEEDED"
            })
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
});

/*
 * Route to get submission based on assignmentId
 */
router.get("/:assignmentId/submissions", requireAuthentication, async function (req, res, next) {
    //Check the role of user based on token
    const user = await getUserById(req.user)

    if(user.role === "admin" || user.role === "instructor"){
        try{
            const submission = await getSubmissionById(req.params.assignmentId)
            if(submission){
                res.status(200).send(submission)
            } else {
                next()
            }
        } catch (e) {
            next (e)
        }
    } else {
        res.status(403).send({
            error : "Unable to access the specified resource."
        })
    }
});

/*
 * Route to post a submission for assignment
 * This functions prob need to be a child of assignments and need to be created based on parent.
 * Function is partially done but still need a lot of work
 */
router.post("/:assignmentId/submissions", requireAuthentication, async function (req, res, next) {
    //check user role
    const user = await getUserById(req.user)

    if(user.role === "student"){
        if(validateAgainstSchema(req.body, SubmissionSchema)){
            try{
                const id = await insertNewSubmission(req.body)
                res.status(201).send({
                    id: id
                })
            } catch (e) {
                next(e)
            }
        } else {
            res.status(400).send({
                error: "Requested body does not contain a valid Assignment."
            })
        }
    } else {
        res.status(403).send({
            error: "Unable to access the specified resource."
        })
    }
});
module.exports = router;