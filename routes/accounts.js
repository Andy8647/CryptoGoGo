// Acocunt routes
const log = console.log

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the Account mongoose model
const { Account } = require('../models/accounts')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

// to validate object IDs
const { ObjectID } = require('mongodb')


/*** account API Routes  ************************************/
// The '/api' indicates that this is a route for a data resource API (in this case, a JSON API).
//  Routes for webpages or static directories (above) will usually not have this prefix.

// a POST route to *create* an account
router.post('/api/accounts', mongoChecker, authenticate, async (req, res) => {
	// log(req.body)

	// Create a new Account using the Account mongoose model
	const account = new Account({
        creator: req.user._id, // creator id from the authenticate middleware
        cash: 100000, 
        positions:[],
        orders:[]
	})

	// Save account to the database
	// async-await version:
	try {
		const result = await account.save()	
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

// a GET route to get all accounts for the logged in user
router.get('/api/accounts', mongoChecker, authenticate, async (req, res) => {
	// Get the accounts
	try {
		const accounts = await Account.find({creator: req.user._id})
		res.send(accounts);
	} catch(error) {
		log(error);
		res.status(500).send("Internal Server Error");
	}

})

/// a GET route to get an account by their id.
// id is treated as a wildcard parameter, which is why there is a colon : beside it.
router.get('/api/accounts/:id', mongoChecker, authenticate, async (req, res) => {

	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
		return; 
	}

	// If id valid, findById
	try {
		const account = await Account.findOne({_id: id, creator: req.user._id})
		if (!account) {
			res.status(404).send('Resource not found')  // could not find this account
		} else { 
			res.send(account)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})

/// a DELETE route to remove an account by their id.
router.delete('/api/accounts/:id', mongoChecker, authenticate, async (req, res) => {
	const id = req.params.id

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}

	// Delete an account by their id
	try {
		const accounts = await Account.find({creator: req.user._id}) // must have more than one account
		if (accounts.length > 1){
			const account = await Account.findOneAndRemove({_id: id, creator: req.user._id})
			if (!account) {
				res.status(404).send()
			} else {   
				res.send(account)
			}
		} else{
			res.status(441).send("User must have at least one account")
		}
	} catch(error) {
		log(error)
		res.status(500).send() // server error, could not delete.
	}
})

// NO UPDATE ROUTES SHOULD BE EXISTING FOR THIS RESOURCE.

// export the router
module.exports = router