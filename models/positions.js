/* Positions mongoose model */
const mongoose = require('mongoose')

const Position = mongoose.model('Position', {
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
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    avgPrice: {
        type: Number,
        required: true
    },
    bookValue: {
        type: Number
    }
})

module.exports = { Position }