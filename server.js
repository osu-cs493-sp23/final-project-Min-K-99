/*
 * This require() statement reads environment variable values from the file
 * called .env in the project directory.  You can set up the environment
 * variables in that file to specify connection information for your own DB
 * server.
 */
require('dotenv').config()

const jwt = require("jsonwebtoken")

const secretKey = "SuperSecret"

const express = require('express')
const morgan = require('morgan')
const redis = require('redis')

const api = require('./api')
const { connectToDb } = require("./lib/mongo");

const app = express()
const port = process.env.PORT || 8000

const redisHost = process.env.REDIS_HOST || "localhost"
const redisPort = process.env.REDIS_PORT || "6379"
const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`
})

const rateLimitWindowMillis = 60000
const rateLimitMaxRequests = 10
const correctRateLimit = 30
const correctRateLimitRefreshRate = correctRateLimit / rateLimitWindowMillis  
const rateLimitRefreshRate = rateLimitMaxRequests / rateLimitWindowMillis

// async function rateLimit(req, res, next){
//   const authHeader = req.get("Authorization") || ""
//   const authHeaderParts = authHeader.split(" ")
//   const token = authHeaderParts[0] === "Bearer" ?
//       authHeaderParts[1] : null

//   const isTokenValid = req.headers.authorization === authHeader
//   const currentRateLimitMaxRequests = isTokenValid ? correctRateLimit : rateLimitMaxRequests
//   const currentRateLimitRefreshRate = isTokenValid ? correctRateLimitRefreshRate : rateLimitRefreshRate
//   console.log("OOGA BOOGA", currentRateLimitMaxRequests)

//   let tokenBucket 
//   try{
//     tokenBucket = await redisClient.hGetAll(req.ip)
//     // console.log("=====tokenBucket:", tokenBucket)
//   }catch (e){
//     next()
//     return
//   }

//   tokenBucket = {
//     tokens: parseFloat(tokenBucket.tokens) || currentRateLimitMaxRequests,
//     last: parseInt(tokenBucket.last) || Date.now()
//   }

//   const timestamp = Date.now()
//   const ellapsedMillis = timestamp - tokenBucket.last
//   tokenBucket.tokens += ellapsedMillis * currentRateLimitRefreshRate
//   tokenBucket.tokens = Math.min(tokenBucket.tokens, currentRateLimitMaxRequests)
//   tokenBucket.last = timestamp

//   if(tokenBucket.tokens >= 1){
//     tokenBucket.tokens -= 1
//     await redisClient.hSet(req.ip, [
//       ["tokens", tokenBucket.tokens],
//       ["last", tokenBucket.last]
//     ])
//     next()
//   } else{
//     await redisClient.hSet(req.ip, [
//       ["tokens", tokenBucket.tokens],
//       ["last", tokenBucket.last]
//     ])
//     res.status(429).send({
//       error: "Too many requests per minute"
//     })
//   }
// }

// const endpointsRequiringToken = ['/users/:userId']
// function applyRateLimit(req, res, next){
//   const requiresToken = endpointsRequiringToken.includes(req.path)
//   if (requiresToken){
//     rateLimit(req, res, next)
//   }
//   else{
//     next();
//   }
// }

// app.use(rateLimit)

/*
 * Morgan is a popular request logger.
 */
app.use(morgan('dev'))

app.use(express.json())

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api)

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

/*
 * This route will catch any errors thrown from our API endpoints and return
 * a response with a 500 status to the client.
 */
app.use('*', function (err, req, res, next) {
  console.error("== Error:", err)
  res.status(500).send({
      err: "Server error.  Please try again later."
  })
})

/*
 * Start the API server listening for requests after establishing a connection
 * to the MySQL server.
 */
connectToDb(async function () {
  redisClient.connect().then(function () {
    app.listen(port, function () {
      console.log("== Server is running on port", port);
    });
  })
});
