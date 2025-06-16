import express from "express";
import {
  registerShop,
  loginShop,
  updateShopInfo,
  getShopInfo,
} from "../controllers/shopController.js";
import {
  authenticateJWT,
  requireShop,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getInfo/:shopId", authenticateJWT, requireShop, getShopInfo);
router.post("/register", registerShop);
router.post("/login", loginShop);
router.put("/update/:shopId", updateShopInfo);

export default router;
