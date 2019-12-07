let mongoose = require('mongoose')

let Schema = mongoose.Schema

let RideSchema = Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    riders: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    originName: {type: String, required: true},
    destinyName: {type: String, required: true},
    originCoordinates: {type: Object, required: true},
    destinyCoordinates: {type: Object, required: true},
    hour: {type: String, required: true},
    date: {type: String, required: true},
    reserved: {type: Boolean, required: true},
    finished: {type: Boolean, required: true, default: false},
    active: {type: Boolean, required: true, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Ride', RideSchema)