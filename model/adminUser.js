const mongoose = require('mongoose')
const Schema = mongoose.Schema


const adminSchema = new Schema({
    adminId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    setTime:{
        type:String,
        required:true
    }
}, { timestamp: true })

const admin = mongoose.model('admin', adminSchema)

module.exports = admin;