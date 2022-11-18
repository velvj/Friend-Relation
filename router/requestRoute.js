const validate = require('../validatation/valid')
const express = require('express')
const router = express.Router()
const requestController = require("../controller/requestController")

router.post('/frirequest', validate.authToken, requestController.createUserId)
router.post('/acceptReq', validate.authToken, requestController.acceptReq)

router.get('/getAll', validate.authToken, requestController.getAll)


module.exports = router