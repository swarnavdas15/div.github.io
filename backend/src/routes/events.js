// routes/eventRoutes.js
import express from "express";
import {
  list,
  get,
  create,
  update,
  remove,
  registerForEvent,
  toggleRegistration,
  uploadImage
} from "../controllers/events.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer configuration for image uploads - using memory storage for Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get("/", list);
router.get("/:id", get);

// Admin protected routes
router.post("/", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, remove);

// Image upload endpoint
router.post("/upload-image", protect, adminOnly, upload.single('image'), uploadImage);

// Extra endpoints
router.post("/:id/toggle-registration", protect, adminOnly, toggleRegistration);
router.post("/:id/register", protect, registerForEvent);


export default router;
