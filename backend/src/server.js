import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import eventRoutes from './routes/events.js';
import photoRoutes from './routes/photos.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contactRoutes.js';
import { protect, adminOnly } from './middleware/authMiddleware.js'; // ✅ include both

dotenv.config();
const app = express();
connectDB();

// 🧩 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,                  // from Render env
  "http://localhost:5173",                 // local dev
  "https://div-github-io.vercel.app",      // main vercel domain
  "https://div-github-io-swarnavdas.vercel.app" // backup / preview domain
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔍 Request Origin:", origin);
      if (!origin) return callback(null, true); // health checks, server-side calls
      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS allowed:", origin);
        return callback(null, true);
      }
      console.warn("🚫 Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📦 Routes (public first)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', contactRoutes);

// 🛡️ Protected routes
app.use('/api/member', protect, memberRoutes);
app.use('/api/admin', protect, adminOnly, adminRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running...');
});

// 🚀 Server listen (Render-compatible)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
