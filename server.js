/* server.js - user & resource authentication */
// Modular version, with express routes imported separately.

'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('bufferCommands', false);  // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.
mongoose.set('useFindAndModify', false); // for some deprecation issues

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

const cors = require('cors');
app.use(cors());

/*** Session handling **************************************/
// express-session for managing user sessions
const session = require('express-session')

// Create a session cookie
app.use(session({
    secret: 'our hardcoded secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000, // 100 minute expiry
        httpOnly: true 
    }
}));

// Order Handle Functions
const {serverTickOrderHandler, serverDailyOrderExpireHandler} = require("./orderHandler")

/** Import the various routes **/
// User and login routes
app.use(require('./routes/user'))
// Account API routes
app.use(require('./routes/accounts'))

// Post API routes
app.use(require('./routes/post'))


// Positions API routes
app.use(require('./routes/positions'))
// Activities API routes
app.use(require('./routes/activities'))
// Orders API routes
app.use(require('./routes/orders'))
// Dashboard API routes
app.use(require('./routes/dashboardApi'))
// Trading API routes
app.use(require('./routes/tradingApi'))




// 404 route at the bottom for anything not found.

// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/sign-up","/sign-in", "/trading", "/community", "/profile", "/adminprofile"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404).send("404 Error: We cannot find the page you are looking for.");
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// ********** SPINNING SERVER JOBS ****************
setInterval(serverTickOrderHandler, 5000) // loops over orders and excecute.
setInterval(serverDailyOrderExpireHandler, 1000 * 60 * 60 * 24) // loops over orders and check for expired.  // Make cron job if have time.



/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 