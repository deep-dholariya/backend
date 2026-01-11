import express from "express";
import { signup, login, getMe, logout, forgotPassword,getAllUsers } from "../controllers/authController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", forgotPassword);

// 📌 SHOW ALL USERS (ADMIN ONLY)
router.get("/all-users", authMiddleware, adminMiddleware, getAllUsers);

export default router;
