const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.SMTP_EMAIL, // sending to self
    subject: 'Test Email',
    text: 'This is a test email.'
};

console.log("Attempting to send test email...");
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Email sending failed:", error);
    } else {
        console.log("Email sent successfully:", info.response);
    }
});
