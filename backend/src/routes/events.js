// routes/eventRoutes.js
import express from "express";
import {
  list,
  get,
  create,
  update,
  remove,
  registerForEvent,
  toggleRegistration
} from "../controllers/events.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", list);
router.get("/:id", get);

// Admin protected routes
router.post("/", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, remove);

// Extra endpoints
router.post("/:id/toggle-registration", protect, adminOnly, toggleRegistration);
router.post("/:id/register", protect, registerForEvent);


export default router;
