
import express from "express";
import { sendOtpEmail, verifyOtp } from "../controllers/otpController.js"; 

const router = express.Router();

router.post("/send-otp", sendOtpEmail);
router.post("/verify-otp", verifyOtp);

export default router;
