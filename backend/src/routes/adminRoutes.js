import express from "express";
import {
  getAllMembers,
  getMemberById,
  deactivateMember,
  deleteMember,
  changeMemberPassword,
  sendMessage,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/members", protect, adminOnly, getAllMembers);
router.get("/members/:id", protect, adminOnly, getMemberById);
router.put("/members/:id/deactivate", protect, adminOnly, deactivateMember);
router.delete("/members/:id", protect, adminOnly, deleteMember);
router.put("/members/:id/password", protect, adminOnly, changeMemberPassword);
router.post("/message", protect, adminOnly, sendMessage);

export default router;
