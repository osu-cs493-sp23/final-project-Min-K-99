const { Router } = require("express");

const router = Router();

const { validateAgainstSchema } = require('../lib/validation')

const { UserSchema, insertNewUser, getUserById, validateUser } = require('../models/user')

const { generateAuthToken, requireAuthentication } = require('../lib/auth')

/*
 * Route to list all of a user's businesses.
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
 * User send id and password
 * Server send back the token after giving clearance to id and password
 */
router.post("/login", async function (req, res, next) {
    if(req.body && req.body.id && req.body.password){
        try{
            const authenticated = await validateUser(
                req.body.id,
                req.body.password
            )
            if (authenticated) {
                const token = generateAuthToken(req.body.id)
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
            error: "Request body require `id` and `password`."
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
                res.status(200).send(user)
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
