/* Comment model */

'use strict';

const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', {
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1
    }
})

module.exports = { Comment }