import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a Nodemailer transporter (using SMTP, you can change it based on your email provider)
const transporter = nodemailer.createTransport({
  service: "gmail", // For example, using Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.NEXT_PUBLIC_API_APP_PASS, // Your email password
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Send OTP email (First request: send OTP)
export const sendOtpEmail = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Generate OTP
  const otp = generateOTP();

  // Create email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Store OTP in session
    req.session.otp = otp; // Store OTP in session
    req.session.email = email; // Store email in session for future verification
    req.session.otpTimestamp = Date.now(); // Store timestamp for expiry validation (5 minutes expiry)

    return res
      .status(200)
      .json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    console.error("Error sending OTP email:", error); // Log the full error
    return res.status(500).json({
      message: "Failed to send OTP, please try again",
      error: error.message,
    });
  }
};

// Verify OTP (Second request: verify OTP)
export const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    // Further processing...
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

