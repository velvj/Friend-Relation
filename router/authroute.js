const validate = require('../validatation/valid')
const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploads')


const Authcontroller = require("../controller/authcontroller")

router.post('/register', validate.signupUser, Authcontroller.register)

router.post('/login', validate.loginUser, Authcontroller.login)

router.get('/getlist', validate.authToken, validate.isAdmin, Authcontroller.getlist)

router.get('/getAllList', Authcontroller.getAllUser)
router.put('/sendMails', Authcontroller.sendMails)

router.get('/exportData', Authcontroller.exportData)
router.get('/exportXlsx', Authcontroller.exportXlsx)
router.post('/importJsonData', upload.single('uploads'), Authcontroller.importJsonData)

router.get('/getid/:id', validate.authToken, Authcontroller.getById)

module.exports = router