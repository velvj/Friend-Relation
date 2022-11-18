const adminData = require('../model/adminUser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
// const {job}=require('../cron/cronFunc');
const moment = require('moment'); // require
moment().format();
const CronJob = require('cron').CronJob;


const createAdmin = async (req, res) => {
    try {
        const listAdmin = new adminData({
            adminId: req.user._id,
            setTime: req.body.setTime
        })
        const savedUser = await listAdmin.save();
        res.status(200).json({ status: 200, message: "success", data: savedUser });

    } catch (error) {
        if (error.code && error.code == 11000) {
            return res.status(400).json({ status: 400, message: "Already exists user!" });
        }
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}

const mailer = async () => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "login",
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.TO_ID,
        subject: ` you receive the mail at admin time `,
        html: `<p>You requested for user detailes, kindly use this <a href=http://localhost:5000/user/PDF/hi >link</a> to find PDF DATA</p>`,
        attachments: {
            path: 'C:\\Node Task\\friendRealation Task\\listdata.xlsx'
        }
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        return console.log("Message sent: %s", info.messageId, info)
    })
    console.log('Your Mail sent successfully');

}


//CRON send  my  excel  data through mail



const adminMails = async (req, res) => {
    try {
        const ID = req.params.id;
        const adminExists = await adminData.find({ _id: ID })
        console.log("adminExists", adminExists)
        if (adminExists) {
            job(adminExists[0].minute, adminExists[0].hour);
            return res.status(200).json({ status: 200, message: "Your Mail sent successfully", data: ` you receive the mail at Hour:${adminExists[0].hour} Minute:${adminExists[0].minute} ` });
            // job.stop()
        } else {
            return res.status(400).json({ status: 404, message: "sender is NoT FounD" });

        }

    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}


//NODE - CRON Schedule Task

//CRON send  my  excel  data through mail



const MailFromAdmin = async () => {
    const timeToCheck = moment().add('55', 'minutes').format('YYYY-MM-DD HH:mm') + ':00'
    console.log(timeToCheck, "timeToCheck");
    console.log('Your Mail sent successfully', moment().format('YYYY-MM-DD HH:mm'));
    const adminExists = await adminData.find({})
    console.log("adminExists", adminExists, adminExists[0].setTime == new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }))
    if (adminExists[0].setTime == new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })) {
        mailer()
        return console.log('Your Mail sent successfully', moment().format("DD MMM YYYY hh:mm:ss"));
    }
    return true
}

//Node - CRON  

// cron.schedule('*/1 * * * *', async () => {
//     console.log("testing");
//     MailFromAdmin()

// }, null,
//     true,
//     'Asia/Kolkata'
// );


module.exports = { createAdmin, adminMails, MailFromAdmin }