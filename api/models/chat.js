let mongoose = require('mongoose')

let Schema = mongoose.Schema

let ChatSchema = Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ride: {type: mongoose.Schema.Types.ObjectId, ref: 'Ride'},
    key: {type: String},
    message: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Chat', ChatSchema)