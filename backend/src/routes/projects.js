import express from "express";
import { list, get, create, update, remove } from "../controllers/projects.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", list);
router.get("/:id", get);

// Admin protected routes
router.post("/", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, remove);

export default router;
