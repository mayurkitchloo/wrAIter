const express = require("express");
const { sendOtp, verifyOtp, resetPassword } = require("../controller/otpController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
