let mongoose = require('mongoose')

let Schema = mongoose.Schema

let UserSchema = Schema({
    name: String,
    email: String,
    expedient: {type: String, unique: true, required: true},
    password: String,
    birthday: String,
    profilePictureUaq: String,
    profilePicture: Buffer,
    college: String,
    career: String,
    semester: Number,
    isDriver: {type: Boolean, required: true, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', UserSchema)