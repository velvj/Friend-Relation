const multer = require('multer')
const path = require('path')


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype == "image/png" || file.mimetype == "text/csv" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ||
            file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            callback(null, true)
        } else {
            callback(new Error("File format is not supported"))
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
})




module.exports = upload





// const upload = multer({ storage: storage })