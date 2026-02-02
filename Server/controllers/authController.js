const User = require('../models/User');
const sendOtpEmail = require('../utils/nodemailer');
const generateToken = require('../utils/generateToken');

// @desc    Request OTP (Login/Signup)
const login = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ message: 'Please provide email or phone number' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        let user;
        const query = email ? { email } : { phoneNumber };

        user = await User.findOne(query);

        if (!user) {
            user = new User({ ...query, otp, otpExpires });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
        }

        await user.save();

        if (email) {
            const emailSent = await sendOtpEmail(email, otp);
            if (!emailSent) {
                return res.status(500).json({ message: 'Failed to send OTP email' });
            }
        } else {
            console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
        }

        res.status(200).json({ message: 'OTP sent successfully', success: true });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, phoneNumber, otp } = req.body;

        if ((!email && !phoneNumber) || !otp) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const query = email ? { email } : { phoneNumber };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    login,
    verifyOtp
};
