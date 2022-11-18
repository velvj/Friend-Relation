const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    response: {
        type: String, enum: ['Accepted', 'Rejected', 'No Response'], default:"No Response"
}}, { timestamp: true })

const friendRequest = mongoose.model('request', requestSchema)

module.exports = friendRequest;