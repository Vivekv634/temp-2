const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;