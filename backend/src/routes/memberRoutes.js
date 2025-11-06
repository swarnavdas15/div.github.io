import express from "express";
import {
  getMemberInfo,
  updateAvatar,
  getMessages,
  updateProfile,
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMemberInfo);
router.put("/avatar", protect, updateAvatar);
router.get("/messages", protect, getMessages);
router.put("/profile", protect, updateProfile);

export default router;
