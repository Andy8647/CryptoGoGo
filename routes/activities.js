const log = console.log
const express = require('express');
const router = express.Router();

const { Activity } = require('../models/activities')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");


// NO API TO CREATE THIS RESOURCE


// a GET route to get all accounts for the logged in user
router.get('/api/activities', mongoChecker, authenticate, async (req, res) => {
	// Get the accounts
	try {
		const activities = await Activity.find({creator: req.user._id})
		res.send(activities.reverse());
	} catch(error) {
		log(error);
		res.status(500).send("Internal Server Error");
	}

})

// NO OTHER API FOR THIS RESOURCE

// export the router
module.exports = router