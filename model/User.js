const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, maxlength: 30},
    email: {type: String, required: true },
    password: {type: String, required: true, minlength: 8 }
})

module.exports = mongoose.model('User', UserSchema)