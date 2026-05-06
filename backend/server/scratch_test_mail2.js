require('dotenv').config({ path: 'd:/Projects/PBL/campus_career_platform/backend/server/.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Using Email:", process.env.SMTP_EMAIL);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: 'temporaman2@gmail.com', // Just to test if it connects and authenticates
        subject: 'Test email from Node',
        text: 'This is a test.'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!", info.response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

testEmail();
