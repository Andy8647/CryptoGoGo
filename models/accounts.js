  
/* Account mongoose model */
const mongoose = require('mongoose')

const Account = mongoose.model('Account', {
	creator: {
		type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cash: {
        type: Number,
        required: true,
    },
    positions: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId]
    }
})

module.exports = { Account }