import express from "express";
import {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  searchProperties,
  approveProperty,
  rejectProperty,
  completeProperty,
  pendingProperty,
  getApprovedProperties,
  getPendingProperties,
  getRejectedProperties,
  getCompletedProperties,
  getApprovedPropertiess,
} from "../controllers/propertyController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/", authMiddleware, createProperty);
router.get("/my", authMiddleware, getMyProperties);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

// SEARCH PROPERTIES
router.get("/search", authMiddleware, searchProperties);

// ADMIN STATUS UPDATES
router.put("/:id/approve", authMiddleware, adminMiddleware, approveProperty);
router.put("/:id/reject", authMiddleware, adminMiddleware, rejectProperty);
router.put("/:id/completed", authMiddleware, adminMiddleware, completeProperty);
router.put("/:id/pending", authMiddleware, adminMiddleware, pendingProperty);

// GET PROPERTIES BY STATUS
router.get("/approved", authMiddleware, getApprovedProperties);
router.get("/pending", authMiddleware, adminMiddleware, getPendingProperties);
router.get("/rejected", authMiddleware, adminMiddleware, getRejectedProperties);
router.get("/completed", authMiddleware, adminMiddleware, getCompletedProperties);
router.get("/approvedd", authMiddleware, adminMiddleware, getApprovedPropertiess);

export default router;
