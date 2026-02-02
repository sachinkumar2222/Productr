const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to not be unique
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    // For OTP flow, we might want to store OTP temporarily or usage hashed
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
