import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Photo from '../models/photos.js';

dotenv.config();
// Configure Cloudinary
try {
   cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});
  console.log('✅ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary configuration error:', error);
}

export const list = async (req, res) => {
  try {
    const photos = await Photo.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch photos' });
  }
};

export const get = async (req, res) => {
  try {
    const p = await Photo.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false });
    res.json({ success: true, data: p });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch photo' });
  }
};

export const upload = async (req, res) => {
  console.log('📤 Photo upload request received');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Content-Type:', req.headers['content-type']);
  
  try {
    // Detailed logging of request data
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request file object:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null);
    console.log('User object:', req.user ? { id: req.user._id, name: req.user.name, role: req.user.role } : null);

    // Validate file upload
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded. Please select an image file.' });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      console.log('❌ Invalid file type:', req.file.mimetype);
      return res.status(400).json({ success: false, message: 'Only image files are allowed.' });
    }

    // Validate file size (max 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', req.file.size);
      return res.status(400).json({ success: false, message: 'File size must be less than 10MB.' });
    }

    // Validate user authentication
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ success: false, message: 'User not authenticated. Please log in.' });
    }

    console.log('✅ All validations passed, uploading to Cloudinary...');

    // Create upload stream
    const bufferStream = streamifier.createReadStream(req.file.buffer);
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'divclub_photos',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (result) {
              console.log('✅ Cloudinary upload successful:', result.secure_url);
              resolve(result);
            } else {
              console.error('❌ Cloudinary upload error:', error);
              reject(error);
            }
          }
        );
        buffer.pipe(stream);
      });
    };

    // Upload to Cloudinary
    const result = await streamUpload(bufferStream);
    
    // Prepare photo data
    const photoData = {
      title: req.body.title || 'Untitled',
      description: req.body.description || '',
      imageUrl: result.secure_url,
      uploaderId: req.user._id,
      uploaderName: req.body.uploaderName || req.user.name || 'Anonymous',
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    console.log('💾 Saving photo to database:', photoData);

    // Save to database
    const photo = await Photo.create(photoData);
    
    console.log('✅ Photo saved to database successfully:', photo._id);
    
    // Return success response
    res.json({
      success: true,
      data: photo,
      message: 'Photo uploaded successfully!'
    });

  } catch (error) {
    console.error('💥 Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({
      success: false,
      message: `Upload failed: ${error.message || 'Unknown error occurred'}`
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const p = await Photo.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Photo not found' });

    const userId = req.user._id.toString();
    
    // Initialize likedBy array if it doesn't exist
    if (!p.likedBy) {
      p.likedBy = [];
    }

    // Check if user already liked this photo
    const alreadyLiked = p.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Remove like (unlike)
      p.likedBy = p.likedBy.filter(id => id !== userId);
      p.likes = Math.max(0, (p.likes || 0) - 1);
    } else {
      // Add like
      p.likedBy.push(userId);
      p.likes = (p.likes || 0) + 1;
    }

    await p.save();
    
    console.log(`🔄 User ${userId} ${alreadyLiked ? 'unliked' : 'liked'} photo ${p._id}. Total likes: ${p.likes}`);
    
    res.json({
      success: true,
      data: {
        _id: p._id,
        likes: p.likes,
        likedBy: p.likedBy,
        isLiked: !alreadyLiked // Return whether user has liked the photo after the toggle
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
};

export const remove = async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, message: 'Failed to delete photo' });
  }
};

export const clearAll = async (req, res) => {
  try {
    await Photo.deleteMany({});
    res.json({ success: true, message: 'All photos cleared' });
  } catch (error) {
    console.error('Error clearing photos:', error);
    res.status(500).json({ success: false, message: 'Failed to clear photos' });
  }
};
