const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter valid email'],
        require: [true, 'Please enter email'],
    },
    photo: String,
    password: {
        type: String,
        require: [true, 'Please enter password'],
        minlength: 6,
        select: false,
    },
    confirmPassword: {
        type: String,
        require: [true, 'Please confirm your password'],
        validate: {
            // This only works on SAVE/CREATE
            validator: function (e) {
                return e === this.password;
            }
        },
        minlength: 6
    }
}, {
    timestamps: true,
    versionKey: false
});

// Encrypting Password
user.pre('save', async function (next) {
    // if password is not modified
    if (!this.isModified('password')) return next();
    // encrypting password.
    this.password = await bcrypt.hash(this.password, 12);
    // clear confirm password after encrypting this.password
    this.confirmPassword = undefined;
    next();
});

// this will available to all instance of USER model
user.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


module.exports = mongoose.model('Users', user);