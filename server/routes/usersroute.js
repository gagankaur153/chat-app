const express = require ('express')
const matchtoken = require('../middleware/usermiddleware')
const { getUserBySearch, getCurrentChatters } = require('../controllers/userscontroller')
const router = express.Router()

router.get('/search', matchtoken, getUserBySearch)

router.get('/getuser', matchtoken, getCurrentChatters)

module.exports = router