const { Router } = require("express");

const router = Router();

const { validateAgainstSchema } = require('../lib/validation')

const { UserSchema, insertNewUser, getUserById, getUserByEmail, validateUser, getUserIdManual } = require('../models/user')

const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { ObjectId } = require("mongodb");

/*
 * Insert new user into `users` collection
 */
router.post("/", async function (req, res, next) {
    if (validateAgainstSchema(req.body, UserSchema)){
        try{
            const id = await insertNewUser(req.body)
            res.status(201).send({_id: id})
        } catch (e) {
            next(e)
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid User."
        })
    }
});

/*
 * Endpoint for user login
 * User send email and password
 * Server send back the token after giving clearance to email and password
 */
router.post("/login", async function (req, res, next) {
    if(req.body && req.body.email && req.body.password){
        try{
            const authenticated = await validateUser(
                req.body.email,
                req.body.password
            )
            const manualId = await getUserIdManual(
                req.body.email, 
                req.body.password)
            
            if (authenticated) {
                const token = generateAuthToken(manualId)
                res.status(200).send({
                    token: token
                })
            } else {
                res.status(401).send({
                    error: "Invalid authentication credentials"
                })
            }
        } catch (e) {
            next(e)
        }
    } else {
        res.status(400).send({
            error: "Request body require `email` and `password`."
        })
    }
});

/*
 * Endpoint to get user's information based on userId
 */
router.get("/:userId", requireAuthentication, async function (req, res, next) {
    if(req.user === req.params.userId){
        try {
            const user = await getUserById(req.params.userId)
            if (user) {
                res.status(200).send({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role
                })
            } else {
                next()
            }
        } catch (e) {
            next(e)
        }
    } else {
        res.status(403).send({
            error: "Unauthorized to access the specified resource."
        })
    }
});
module.exports = router;
