const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../config/emailService");

// Generate a random 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

//@desc Send OTP to user email
//@route POST /api/auth/send-otp
//@access Public
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email: email.toLowerCase() });

        // Generate new OTP
        const otp = generateOtp();

        // Store OTP (hashed via pre-save hook) with 10 min expiry
        await Otp.create({
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        // Send OTP via email
        await sendOtpEmail(email, otp);

        // Also log OTP to console for development/testing
        console.log(`[DEV] OTP for ${email}: ${otp}`);

        res.status(200).json({ message: "OTP sent successfully to your email" });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
};

//@desc Verify OTP
//@route POST /api/auth/verify-otp
//@access Public
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Find the OTP record
        const otpRecord = await Otp.findOne({ email: email.toLowerCase() });

        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found. Please request a new one." });
        }

        // Check if max attempts exceeded
        if (otpRecord.attempts >= 5) {
            await Otp.deleteMany({ email: email.toLowerCase() });
            return res.status(429).json({ message: "Too many attempts. Please request a new OTP." });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteMany({ email: email.toLowerCase() });
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Increment attempts
        otpRecord.attempts += 1;

        // Verify OTP
        const isMatch = await otpRecord.matchOtp(otp);

        if (!isMatch) {
            await otpRecord.save();
            const remaining = 5 - otpRecord.attempts;
            return res.status(400).json({
                message: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
            });
        }

        // Mark as verified
        otpRecord.verified = true;
        await otpRecord.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Failed to verify OTP. Please try again." });
    }
};

//@desc Reset password (after OTP verification)
//@route POST /api/auth/reset-password
//@access Public
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if OTP was verified
        const otpRecord = await Otp.findOne({
            email: email.toLowerCase(),
            verified: true,
        });

        if (!otpRecord) {
            return res.status(403).json({ message: "OTP verification required before resetting password" });
        }

        // Find user and update password
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = newPassword;
        await user.save(); // pre-save hook will hash the password

        // Cleanup: delete all OTP records for this email
        await Otp.deleteMany({ email: email.toLowerCase() });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to reset password. Please try again." });
    }
};
