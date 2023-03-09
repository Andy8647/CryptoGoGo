  
/* Activity mongoose model */
const mongoose = require('mongoose')

const Activity = mongoose.model('Activity', {
	creator: {
		type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
    },
    type: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    link: {
        type: String
    }
})

module.exports = { Activity }