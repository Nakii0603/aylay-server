import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { email, password, phoneNumber, userName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Optional: Validate phone number format if provided (this is just an example)
    const phoneRegex = /^[0-9]{10}$/; // Example phone number validation (adjust as needed)
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(200).json({ message: "Invalid phone number format" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique UUID for userId
    const customUserId = uuidv4();

    // Create a new user object with UUID as the userId
    const newUser = new User({
      email,
      password: hashedPassword,
      userId: customUserId, // Use custom UUID for userId
      userName: userName || null,
      phoneNumber: phoneNumber || null, // Use phoneNumber if provided, else null
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // 1 hour expiration
    });

    // Send a successful response with the token and user details (including userId and phoneNumber)
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
      userName: newUser.userName,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, could not register user" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Email or password wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Email or password wrong" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user.userId
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, could not log in" });
  }
};

// Update phone number
export const updatePhoneNumber = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phoneNumber } = req.body;

    // Check if the user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the phone number
    user.phoneNumber = phoneNumber || null; // If phoneNumber is provided, update it; otherwise, set it as null

    // Save the updated user
    await user.save();

    // Return a response
    res.status(200).json({
      message: "Phone number updated successfully",
      user: { email: user.email, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, could not update phone number" });
  }
};
