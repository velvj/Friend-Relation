const mongoose = require('mongoose')
const Schema = mongoose.Schema


const friendsSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'usermaster'
    },
    friendID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'usermaster'
    }
}, { timestamp: true })

const friendsList = mongoose.model('friendsList', friendsSchema)

module.exports = friendsList;