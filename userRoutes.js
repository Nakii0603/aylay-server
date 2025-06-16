import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import {
    authenticateJWT,
    requireUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/user/dashboard", authenticateJWT, requireUser, (req, res) => {
    res.json({ message: "Welcome to the user dashboard!" });
});

export default router;
