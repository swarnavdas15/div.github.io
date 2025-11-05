import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Contact form submission route
router.post('/contact', sendContactMessage);

export default router;