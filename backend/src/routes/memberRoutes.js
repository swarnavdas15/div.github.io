import express from "express";
import {
  getMemberInfo,
  updateAvatar,
  getMessages,
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMemberInfo);
router.put("/avatar", protect, updateAvatar);
router.get("/messages", protect, getMessages);

export default router;
