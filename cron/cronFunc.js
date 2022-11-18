const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const adminData = require('../model/adminUser');


async function mailer() {
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

async function adminTime (req,res){
const adminExists = await adminData.find({})
console.log("adminExists", adminExists)
if (adminExists) {
    if(adminExists[0].hour)
    job(adminExists[0].minute, adminExists[0].hour);
    return res.status(200).json({ status: 200, message: "Your Mail sent successfully", data: ` you receive the mail at Hour:${adminExists[0].hour} Minute:${adminExists[0].minute} ` });
    // job.stop()
} else {
    return res.status(400).json({ status: 404, message: "sender is NoT FounD" });

}
}
adminTime();


async function job(min,hour)
 { var jobs = new CronJob(
      `${min} ${hour} * * *`,
   async ()=> {
         mailer();
    },
    null,
    true,
    'Asia/Kolkata'
)
jobs.start()
}

module.exports = {job}

