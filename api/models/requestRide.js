let mongoose = require('mongoose')

let Schema = mongoose.Schema

let RequestRideSchema = Schema({
    ride: {type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true},
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rider: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    pending: {type: Boolean, required: true, default: true},
    accepted: {type: Boolean},
    reason: {type: String},
    createdAt: {type: Date, default: Date.now, required: true},
    updatedAt: {type: Date, default: Date.now, required: true}
})

module.exports = mongoose.model('RequestRide', RequestRideSchema)