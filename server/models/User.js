const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength: [6, 'The password should be at least 6 characters long']
    },
})

userSchema.pre('save', function(next) {
    console.log('before save', this);
    next();
});
userSchema.post('save', function(doc, next) {
    console.log('after save', doc);
    next();
});
const User = mongoose.model('user', userSchema);
module.exports = User;