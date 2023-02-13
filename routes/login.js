const express = require("express");
const { login, refreshToken, logout ,resetPassword, updatePassword,verifyOtp, resetPasswordAdmin ,updatePasswordAdmin, checkResetKey} = require("../controllers/login");
const router = express.Router();


router.post("/login",login );

router.post("/refresh-token", refreshToken)

router.post("/logout", logout)

router.post("/reset-password",resetPassword)

router.post('/verify-otp',verifyOtp)

router.post("/update-password",updatePassword)

router.post("/admin-reset-password",resetPasswordAdmin)

router.post('/check-reset-key',checkResetKey)

router.post("/update-password-admin",updatePasswordAdmin)

module.exports = router;
