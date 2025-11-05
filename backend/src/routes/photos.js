import { Router } from 'express';
import {list, get, toggleLike, upload, remove, clearAll} from '../controllers/photos.js';
import multer from 'multer';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() }); // memory buffer

// Public routes
router.get('/', list);
router.get('/:id', get);

// Protected routes
router.post('/:id/toggle-like', protect, toggleLike);

// Admin protected routes
router.post('/upload', protect, uploadMiddleware.single('image'), upload);
router.delete('/:id', protect, adminOnly, remove);
router.delete('/', protect, adminOnly, clearAll);

export default router;
