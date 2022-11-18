const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name:
    {
        type: String
    },
    email:
    {
        type: String,
        unique: true
    },
    phone:
    {
        type: Number,
        unique: true
    },
    password:
    {
        type: String
    }

    ,
    isAdmin: {
        type: Boolean,
        default:false,
        required:true
    }
}, { timestamp: true })

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id ,isAdmin:this.isAdmin}, process.env.ACCESS_TOKEN)
    return token;
}


const usermaster = mongoose.model('usermaster', userSchema)

module.exports = usermaster;