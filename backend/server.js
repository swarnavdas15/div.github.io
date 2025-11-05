import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from "./src/routes/adminRoutes.js";
import memberRoutes from "./src/routes/memberRoutes.js";
import eventRoutes from './src/routes/events.js'
import photoRoutes from './src/routes/photos.js'
import projectsRoutes from './src/routes/projects.js'
import contactRoutes from './src/routes/contactRoutes.js'

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL, // frontend allowed
  credentials: true,
}));

// Special handling for multipart form data (file uploads)
import multer from 'multer';
import { protect } from './src/middleware/authMiddleware.js';

// Apply JSON parser for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/member", memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', contactRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
