const express = require('express')
const {sendMessage, getMessage} = require ('../controllers/messagecontroller');
const matchtoken = require('../middleware/usermiddleware');

const router = express.Router();

router.post('/send/:id',matchtoken,sendMessage )

router.get('/:id', matchtoken, getMessage)




module.exports = router;