const express = require('express')
const {
  sendMessage,
  sendGroupMessage,
  getMessage,
  getGroupMessage,
  alluser,
  createGroup,
} = require('../controllers/messagecontroller');
const matchtoken = require('../middleware/usermiddleware');

const router = express.Router();

router.get('/alluser', matchtoken, alluser)

router.post('/group', matchtoken, createGroup)

router.post('/group/send/:id', matchtoken, sendGroupMessage)

router.get('/group/:id', matchtoken, getGroupMessage)

router.post('/send/:id',matchtoken,sendMessage )

router.get('/:id', matchtoken, getMessage)




module.exports = router;
