import express from "express";
import { updateProfile, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", authMiddleware, updateProfile);
router.delete("/delete", authMiddleware, deleteUser);

export default router;
