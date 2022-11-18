const User = require('../model/users')
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');
var fs = require('fs')
const XLSX = require('xlsx')
var CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');


//CRON send  my  excel  data through mail



const sendMails =async(req,res)=>{
try{var job = new CronJob(
    '0 */1 * * * *', // Every minute
    function () {
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
            subject: 'hello Your user detail',
            html: `<p>You requested for order detailes, kindly use this <a href=http://localhost:5000/user/PDF/hi >link</a> to find PDF DATA</p>`,
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
        console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
);
    job.start()
} catch (error) {
    return res.status(400).json({ status: 400, message: error.message || error });
}
}





const getAllUser = async (req, res) => {
    try {
       
        let listdata = await User.find().select(['-password', '-__v', '-_id']);
        return res.status(200).send({ status: 200, message: "successfully listed", data: listdata })

    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}


// convert to json to excel file and highlight the heading
const exportData = async (req, res) => {
    try {
        var listdata = await User.find().select(['-password', '-__v', '-_id']);
        let workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet("listdata")
        sheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "EmailID", key: "email", width: 50 },
            { header: "PhoneNumber", key: "phone", width: 50 },
            { header: "IsAdmin", key: "isAdmin", width: 50 }
        ]
        //  let count =1;
        //     await listdata.forEach((val)=>{
        //         val.s_no=count;
        //         sheet.addRow(val);
        //         count+=1;

        //     })
        await listdata.map(val => {
            sheet.addRow({
                name: val.name,
                email: val.email,
                phone: val.phone,
                isAdmin: val.isAdmin
            })
        })
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' },
                bgColor: { argb: '004e47cc' }
            };
        })
        await workbook.xlsx.writeFile("listdata.xlsx")

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=" + "listdata.xlsx"
        )

        await workbook.xlsx.write(res)
    //    return res.status(200).json({ status: 200, message: "success" });

    } catch (err) {
        return res.status(400).json({ status: 400, message: err.message || err });
    }
}

//mongodb data to excel xlsx data using  XLSX

const exportXlsx = async (req, res) => {
    try {
        var listdata = await User.find().select(['-password', '-__v']);
        var wb = XLSX.utils.book_new();
    
                var temp = JSON.stringify(listdata);
                temp = JSON.parse(temp);
                var ws = XLSX.utils.json_to_sheet(temp);
                var down = __dirname + '/public/exportdata.xlsx'
                XLSX.utils.book_append_sheet(wb, ws, "sheet1");
                XLSX.writeFile(wb, down);
                res.download(down)
                res.status(200).json({ status: 200, message: "success" });

        
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}


//convert xlsx data into json data using XLSX
const importJsonData = async (req, res) => {
    try {

        var workbook = XLSX.readFile(req.file.path);
        var sheetName = workbook.SheetNames;
        sheetName.forEach(async () => {
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
            for (let i = 0; i < xlData.length; i++) {
                if (!xlData[i]._id) {
                    User.create(xlData[i]);
                    res.status(200).json({ status: 200, message: "success" });

                } else {
                    const userExist = await User.findById(xlData[i]._id);

                    if (!(JSON.stringify(userExist) === JSON.stringify(xlData[i]))) {
                        await User.updateOne({ _id: xlData[i]._id }, { $set: xlData[i] }, { new: true });
                        res.status(200).json({ status: 200, message: "success" });

                    }
                }
            }
        })
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}


const register = async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPass,
            isAdmin: false
        });
        const savedUser = await user.save();
        res.status(200).json({ status: 200, message: "success", data: savedUser });
    } catch (error) {
        console.log(error);
        if (error.code && error.code == 11000) {
            return res.status(400).json({ status: 400, message: "Already exists user!" });
        }
        res.status(400).json({ status: 400, message: error.message || error });
    }
}


const login = async (req, res, next) => {
    try {
        var username = req.body.username
        var password = req.body.password
        const user = await User.findOne({ $or: [{ email: username }] })

        if (user) {
            const result = await bcrypt.compare(password, user.password)
            console.log(result, user.password, password);

            if (result) {
                let token = user.generateToken();
                // console.log(token); 
                const data = { "name": user.name, "email": user.email, "phone": user.phone, "token": token };

                return res.header("x-auth-token", token).status(200).json({ status: 200, message: 'login succesfully', data: data })

            }

            else {
                return res.json("incorrect password")
            }
        }
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}


const getlist = async (req, res) => {
    try {
      
        let listdata = await User.find({ _id: { $nin: [req.user._id] } }).select(['-password', '-__v', '-_id']);
        return res.status(200).json({ status: 200, message: "successfully listed", data: listdata })

    } catch (err) {
        console.log(err)
    }
}
// const getId = async (req, res) => {
//     try {
//         console.log(req.user, "test");
//         let listdata = await User.findById({ _id: { $nin: [req.user._id] } }).select(['-password', '-__v', '-_id']);
//         return res.status(200).json({ status: 200, message: "successfully listed", data: listdata })

//     } catch (err) {
//         console.log(err)
//     }
// }

const getById = async (req, res) => {
    try {
        let listdata = await User.findById({ _id: req.params.id }).select(['-password', '-__v', '-_id']);
        return res.status(200).json({ status: 200, message: "successfully listed", data: listdata })

    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    register, getlist, login, getById, getAllUser, exportData, exportXlsx, importJsonData, sendMails
}