  
/* Orders mongoose model */
const mongoose = require('mongoose')

const Order = mongoose.model('Order', {
    creator: {
		type: mongoose.Schema.Types.ObjectId,
        required: true
    },
	account: {
		type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    orderType: {
        type: String,
        required: true,
    },
    limit: {
        type: Number
    },
    stop: {
        type: Number
    },
    duration: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    parentOrder: {
        type: mongoose.Schema.Types.ObjectId // ID of another order, used if bracket order.
    },
    timePlaced: {
        type: Date,
        required: true
    },
    cashOnHold: {
        type: Number
    }
})

module.exports = { Order }