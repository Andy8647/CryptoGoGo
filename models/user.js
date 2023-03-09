'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const { ObjectID } = require('bson');
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail, 
			message: 'Not valid email'
		}
	}, 
	password: {
		type: String,
		required: true,
		minlength: 4
	},
	username: {
		type: String,
		required: true,
		minlength: 4,
		unique: true
	},
	recentActivities: {
		type: [mongoose.Schema.Types.ObjectId]
	},
	UserAccounts: {
		type: [mongoose.Schema.Types.ObjectId]
	},
	profession: {
		type: String
	},
	Address: {
		type: String
	},
	userPosts: {
		type: [mongoose.Schema.Types.ObjectId]
	},
	isAdmin: {
		type: Boolean,
		required: true
	}
})

UserSchema.pre('save', function(next) {
	const user = this; 
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})


UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this 

	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  
		}
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

const User = mongoose.model('User', UserSchema)
module.exports = { User }