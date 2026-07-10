const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * Sends an email using the configured transporter.
 * Falls back to console logging in case of failure (useful for development).
 */
const sendEmail = async ({ to, subject, html, text, fallbackOtp }) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Email sending failed:", error.message);
        
        // Log fallback for development
        if (fallbackOtp) {
            console.log(`\n=================================================`);
            console.log(`[FALLBACK] SMTP failed. OTP for ${to} is: ${fallbackOtp}`);
            console.log(`=================================================\n`);
        } else {
            console.log(`\n=================================================`);
            console.log(`[FALLBACK] SMTP failed. Email to: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${text}`);
            console.log(`=================================================\n`);
        }

        return { 
            success: false, 
            message: "Email delivery failed, check server logs for fallback.",
            error: error.message 
        };
    }
};

module.exports = { sendEmail };
