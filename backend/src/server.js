import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import eventRoutes from './routes/events.js'
import photoRoutes from './routes/photos.js'
import projectsRoutes from './routes/projects.js'
import contactRoutes from './routes/contactRoutes.js'

dotenv.config();
const app = express();
connectDB();

// Apply JSON parser for all routes

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Special handling for multipart form data (file uploads)
import multer from 'multer';
import { protect } from './middleware/authMiddleware.js';

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
