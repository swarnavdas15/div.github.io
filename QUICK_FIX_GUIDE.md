# 🚀 Quick Fix Guide: "Failed to Fetch" Error

## ✅ **Issue Fixed**
The "failed to fetch" error was caused by your frontend trying to connect to a non-existent URL. I've fixed the configuration.

## 🔧 **Changes Made**

### 1. Frontend Configuration (`my-project/.env`)
**Before:** `VITE_API_URL=https://your-backend-service.onrender.com` ❌
**After:** `VITE_API_URL=http://localhost:5000` ✅

### 2. Vite Configuration (`my-project/vite.config.js`)
**Before:** `target: 'https://your-backend-service.onrender.com'` ❌
**After:** `target: 'http://localhost:5000'` ✅

### 3. Backend Configuration (`backend/.env`)
**Before:** `CLIENT_URL=https://div-github-io.vercel.app` ❌
**After:** `CLIENT_URL=http://localhost:5173` ✅

## 🏃 **How to Run (Step by Step)**

### **Step 1: Start MongoDB**
Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### **Step 2: Start Backend**
```bash
cd backend
npm install  # If not already installed
npm run dev  # Starts backend on port 5000
```

You should see: `🚀 Server running on port 5000`

### **Step 3: Start Frontend**
```bash
cd my-project
npm install  # If not already installed
npm run dev  # Starts frontend on port 5173
```

You should see: `Local: http://localhost:5173`

### **Step 4: Test the Connection**
1. Open http://localhost:5173 in your browser
2. The "failed to fetch" error should be gone
3. Try logging in or registering a new account
4. Check member dashboard, events, photowall, and projects

## 🔍 **Troubleshooting**

### **If you still get "failed to fetch":**
1. **Check backend is running**: Visit http://localhost:5000 - you should see "✅ Backend is running..."
2. **Check MongoDB**: Make sure MongoDB service is started
3. **Check ports**: Ensure ports 5000 and 5173 are not blocked by firewall
4. **Clear browser cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### **Common Issues:**
- **"Cannot connect to MongoDB"**: Install and start MongoDB
- **"Port 5000 already in use":** Close other applications using that port
- **"Module not found"**: Run `npm install` in both directories

## 📊 **Expected Results**
- ✅ No more "failed to fetch" errors
- ✅ Member details should load in dashboard
- ✅ Events should display and create
- ✅ Photowall should show photos
- ✅ Projects should load and create

## 🌐 **For Production Later**
Once everything works locally, you'll need to:
1. Deploy backend to a service like Render/Heroku
2. Get real Cloudinary credentials
3. Use MongoDB Atlas (cloud database)
4. Update environment variables with production URLs

The core issue is now fixed - your frontend and backend should be able to communicate properly!