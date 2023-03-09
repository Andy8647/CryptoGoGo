const log = console.log
const express = require('express');
const router = express.Router();

const { Position } = require('../models/positions')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");
// to validate object IDs
const { ObjectID } = require('mongodb')


// NO API TO CREATE THIS RESOURCE


// a GET route to get positions by account
router.get('/api/positions/:account', mongoChecker, authenticate, async (req, res) => {
    // Get the accounts
    const account = req.params.account;

    // Good practise: Validate id immediately.
	if (!ObjectID.isValid(account)) {
		res.status(404).send();
		return; 
	}
	try {
		const positions = await Position.find({creator: req.user._id, account: account})
		res.send(positions);
	} catch(error) {
		log(error);
		res.status(500).send("Internal Server Error");
	}
})

// NO OTHER API FOR THIS RESOURCE

// export the router
module.exports = router