const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true },
        otp: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        attempts: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Auto-delete expired OTPs after 15 minutes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash OTP before saving
otpSchema.pre('save', async function () {
    if (!this.isModified('otp')) return;
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
});

// Compare OTP
otpSchema.methods.matchOtp = async function (enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otp);
};

module.exports = mongoose.model('Otp', otpSchema);
