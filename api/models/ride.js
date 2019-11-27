let mongoose = require('mongoose')

let Schema = mongoose.Schema

let RideSchema = Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    riders: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    origin: {type: String, required: true},
    destiny: {type: String, required: true},
    hour: {type: String, required: true},
    date: {type: Date},
    reserved: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Ride', RideSchema)