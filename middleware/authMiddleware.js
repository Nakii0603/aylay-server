// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
    } else if (decoded.shopId) {
      req.shopId = decoded.shopId;
    } else {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireUser = (req, res, next) => {
  if (!req.userId) {
    return res.status(403).json({ message: "Access denied: users only" });
  }
  next();
};

export const requireShop = (req, res, next) => {
  if (!req.shopId) {
    return res.status(403).json({ message: "Access denied: shops only" });
  }
  next();
};
