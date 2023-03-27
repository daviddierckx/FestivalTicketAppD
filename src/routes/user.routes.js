const express = require('express')
const router = express.Router()

const User = require('../models/user.model')// note we need to call the model caching function
const UserController = require('../controllers/user.controller')
const UserCrudController = new UserController(User)

const auth = require("../middleware/auth")


router.post('/:email', auth, UserCrudController.addFriend)
router.post('/accept/:email', auth, UserCrudController.acceptFriend)
router.post('/follow/:email', auth, UserCrudController.follow)
router.post('/unfollow/:email', auth, UserCrudController.unfollow)
router.post('/comment/:festivalId', auth, UserCrudController.addComment)
router.post('/reply/:commentId', auth, UserCrudController.addReply)

router.get('/friends', auth, UserCrudController.getFriends)
router.get('/followers', auth, UserCrudController.getFollowers)
router.get('/followed', auth, UserCrudController.getFollowed)
router.get('/comments/:festivalId', UserCrudController.getAllCommentsWithReplies)
module.exports = router