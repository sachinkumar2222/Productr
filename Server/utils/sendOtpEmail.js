const sgMail = require('../config/sendgrid');
const { getOtpEmailTemplate } = require('./emailTemplates');

const sendOtpEmail = async (email, otp) => {
  try {
    const htmlTemplate = getOtpEmailTemplate(otp);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Productr Support'
      },
      subject: 'Your Productr Login Verification Code',
      html: htmlTemplate
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(
      'SendGrid Error:',
      error.response?.body || error.message
    );
    return false;
  }
};

module.exports = sendOtpEmail;
