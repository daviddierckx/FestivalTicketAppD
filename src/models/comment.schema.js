const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const getModel = require('./model_cache')

const CommentSchema = new Schema({
    festivalId: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    commentId: {
        type: String,
        required: true
    }
})




module.exports = getModel('Comment', CommentSchema)