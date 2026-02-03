const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Robustness settings for cloud (Render/AWS)
    family: 4, // Force IPv4
    logger: true, // Log to console
    debug: true, // Include debug info
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("Transporter verification error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

module.exports = transporter;
