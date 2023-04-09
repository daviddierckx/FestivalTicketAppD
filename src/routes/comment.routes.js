const express = require('express')
const router = express.Router()

const Comment = require('../models/comment.schema')()// note we need to call the model caching function

// const CommentNeoControllerr = require('../controllers/comment.controller')

// const CommentNeoCrudController = new CommentNeoControllerr(Comment)

const auth = require("../middleware/auth")

// router.post('/comment/:festivalId', auth, CommentNeoCrudController.addComment)

module.exports = router