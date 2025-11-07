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

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file!'), false);
  }
};

const upload = multer({ 
  storage,
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
