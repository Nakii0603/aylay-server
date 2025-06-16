import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Shop from "../models/Shop.js";
import { v4 as uuidv4 } from "uuid";

export const registerShop = async (req, res) => {
  try {
    const { email, password, phoneNumber, shopName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(200)
        .json({ message: "Email, password, and shop name are required" });
    }

    // Optional: Validate phone number format if provided
    const phoneRegex = /^[0-9]{10}$/; // Example phone number validation (adjust as needed)
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(200).json({ message: "Invalid phone number format" });
    }

    // Check if the email is already in use
    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      return res.status(200).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a custom shopId
    const customShopId = uuidv4();

    // Create a new shop instance
    const newShop = new Shop({
      email,
      password: hashedPassword,
      shopId: customShopId,
      shopName: shopName || null,
      phoneNumber: phoneNumber || null, // Use phoneNumber if provided, else null
    });

    // Save the Shop to the database
    await newShop.save();

    // Generate a JWT token
    const token = jwt.sign({ shopId: newShop._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // 1 hour expiration
    });

    // Send a successful response with the token and Shop details
    res.status(201).json({
      message: "Shop registered successfully",
      shopId: newShop.shopId,
      shopName: newShop.shopName,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, could not register Shop" });
  }
};

// Login Shop
export const loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(200).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ shopId: shop._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      shopId: shop.shopId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, could not log in" });
  }
};


// Update Shop Information (Phone Number & Shop Name) using shopId
export const updateShopInfo = async (req, res) => {
  try {
    const { shopId } = req.params; // We use shopId from URL parameters
    const { phoneNumber, shopName } = req.body; // Phone and shopName from request body

    // Check if the Shop exists using the provided shopId
    const shop = await Shop.findOne({ shopId });
    if (!shop) {
      return res.status(200).json({ message: "Shop not found" });
    }

    // Update phone number if provided
    if (phoneNumber) {
      // Optional: Validate phone number format if you wish
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Example phone number validation
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(200).json({ message: "Invalid phone number format" });
      }
      shop.phoneNumber = phoneNumber;
    }

    // Update shop name if provided
    if (shopName) {
      shop.shopName = shopName;
    }

    // Save the updated Shop information
    await shop.save();

    // Return a response with the updated shop details
    res.status(200).json({
      message: "Shop information updated successfully",
      shop: {
        email: shop.email,
        phoneNumber: shop.phoneNumber,
        shopName: shop.shopName,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, could not update shop information" });
  }
};

export const getShopInfo = async (req, res) => {
  try {
    const { shopId } = req.params; // shopId from URL parameters

    // Find the shop in the database using the shopId
    const shop = await Shop.findOne({ shopId });
    if (!shop) {
      return res.status(200).json({ message: "Shop not found" });
    }

    // Return the shop details
    res.status(200).json({
      shop: {
        shopId: shop.shopId,
        email: shop.email,
        shopName: shop.shopName,
        phoneNumber: shop.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, could not retrieve shop information" });
  }
};
