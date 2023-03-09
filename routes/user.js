// User routes
const log = console.log

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the user mongoose model
const { User } = require('../models/user')
const { Account } = require('../models/accounts')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

/*** User API routes ****************/
// Set up a POST route to create a user of your web app (*not* a student).
router.post('/api/users', mongoChecker, async (req, res) => {

	const user = new User({
		email: req.body.email,
		password: req.body.password,
		username: req.body.username,
		recentActivities: [],
		UserAccounts: [],
		userPosts: [],
		isAdmin: req.body.isAdmin
	})

	try {
		// Save the user
		const newUser = await user.save()
		// Also create a new account for the user on signup
		const account = new Account({
			creator: newUser._id, // creator id from the authenticate middleware
			cash: 100000, 
			positions:[],
			orders:[]
		})
		await account.save()	

		res.send(newUser)
	} catch (error) {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

//////////////

/*** Login and Logout routes ***/
// A route to login and create a session
router.post('/api/users/login', mongoChecker, (req, res) => {
	const username = req.body.username
	const password = req.body.password
	
	User.findByUsernamePassword(username, password)
        .then(user => {
            // Add the user's id to the session.
            // We can check later if this exists to ensure we are logged in.
			req.session.user = user._id;
			req.session.isAdmin = user.isAdmin
            req.session.username = user.username;
            res.send({ currentUser: user.username, isAdmin: user.isAdmin });
        })
        .catch(error => {
            res.status(400).send()
        });

})

router.get('/api/users/logout', (req, res) => {
	// Remove the session
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.send()
		}
	})
})

// A route to check if a user is logged in on the session
router.get("/users/check-session", (req, res) => {
    if (req.session.user) {
        res.send({ currentUser: req.session.username, isAdmin: req.session.isAdmin });
    } else {
        res.status(401).send();
    }
});


// export the router
module.exports = router
