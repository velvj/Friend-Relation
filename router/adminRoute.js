const validate = require('../validatation/valid')
const express =require('express')
const router = express.Router()
const admin =require('../controller/adminController')


router.post('/createAdmin', validate.authToken, validate.isAdmin,admin.createAdmin)
router.put('/adminMails/:id', validate.authToken, validate.isAdmin, admin.adminMails)
router.put('/mailfromadmin/:id', validate.authToken, validate.isAdmin, admin.MailFromAdmin)



module.exports=router