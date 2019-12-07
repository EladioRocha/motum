let mongoose = require('mongoose')

let Schema = mongoose.Schema

let RideSchema = Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    riders: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    originName: {type: String, required: true},
    destinyName: {type: String, required: true},
    originCoordinates: {type: String, required: true},
    destinyCOordinate: {type: String, required: true},
    hour: {type: String, required: true},
    date: {type: Date},
    reserved: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Ride', RideSchema)