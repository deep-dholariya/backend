import express from "express";
import {
  createContactRequest,
  markDealDone,
  markNotInterested,
  setPending,
  getPendingRequests,
  getDealDoneRequests,
  getNotInterestedRequests,
  getMyInterest,
  deleteRequest,
  userPending,
  userDealDone,
  userNotInterested
} from "../controllers/contactRequestController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE CONTACT REQUEST
router.post("/:propertyId", authMiddleware, createContactRequest);

// MARK STATUS
router.put("/:id/deal-done", authMiddleware, markDealDone);
router.put("/:id/not-interested", authMiddleware, markNotInterested);
router.patch("/set-pending/:id", authMiddleware, setPending);

// GET ONLY ADMIN CONTACT REQUESTS
router.get("/pending", authMiddleware,adminMiddleware, getPendingRequests);
router.get("/deal-done", authMiddleware,adminMiddleware, getDealDoneRequests);
router.get("/not-interested", authMiddleware,adminMiddleware, getNotInterestedRequests);

// GET ONLY USER CONTACT REQUESTS
router.get("/user-pending", authMiddleware, userPending);
router.get("/user-deal-done", authMiddleware, userDealDone);
router.get("/user-not-interested", authMiddleware, userNotInterested);

// ================================
// GET MY PENDING INTEREST (USER)
router.get("/my-interest", authMiddleware, getMyInterest);
// =============================================

// DELETE CONTACT REQUEST
router.delete("/:id", authMiddleware, deleteRequest);

export default router;
