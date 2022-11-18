const validate = require('../validatation/valid')
const express = require('express')
const router = express.Router()
const friendsController = require("../controller/friendsController")

router.post('/frirequest', validate.authToken, friendsController.createFriends)
// router.post('/acceptReq', validate.authToken, friendsController.acceptReq)

router.get('/getAll', validate.authToken, friendsController.getlist)
router.get('/getbyUser/:id', validate.authToken, friendsController.getbyUser)


module.exports = router