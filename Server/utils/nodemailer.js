const transporter = require('../config/nodemailer');
const { getOtpEmailTemplate } = require('./emailTemplates');

const sendOtpEmail = async (email, otp) => {
    try {
        const htmlTemplate = getOtpEmailTemplate(otp);

        const mailOptions = {
            from: `"Productr Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Productr Login Verification Code',
            html: htmlTemplate
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendOtpEmail;
