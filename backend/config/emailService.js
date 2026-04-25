const nodemailer = require('nodemailer');

// Create transporter — uses Gmail if credentials are provided,
// otherwise falls back to Ethereal (test email service).
let transporter = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use real Gmail SMTP
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("Email transporter: Gmail configured");
    } else {
        // Fallback to Ethereal (free test email service)
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log("Email transporter: Ethereal (test mode)");
        console.log("View test emails at: https://ethereal.email/login");
        console.log("Ethereal credentials:", testAccount.user, testAccount.pass);
    }

    return transporter;
};

/**
 * Send OTP email to the user
 * @param {string} email - recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (email, otp) => {
    const transport = await getTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER || '"wrAIter" <noreply@wraiter.com>',
        to: email,
        subject: 'wrAIter — Password Reset OTP',
        html: `
            <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0;">wr<span style="color: #6366f1;">AI</span>ter</h1>
                </div>
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f0ff 100%); border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e8e8f0;">
                    <p style="font-size: 14px; color: #64648b; margin: 0 0 8px;">Your verification code is</p>
                    <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6366f1; margin: 16px 0; font-family: monospace;">${otp}</div>
                    <p style="font-size: 13px; color: #9999b3; margin: 16px 0 0;">This code expires in <strong>10 minutes</strong></p>
                </div>
                <p style="font-size: 13px; color: #9999b3; text-align: center; margin-top: 24px;">
                    If you didn't request this code, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    const info = await transport.sendMail(mailOptions);

    // Log preview URL for Ethereal test emails
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log("Preview OTP email:", previewUrl);
    }

    return info;
};

module.exports = { sendOtpEmail };
