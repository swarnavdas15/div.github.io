import Event from "../models/event.js";
import User from "../models/User.js"; // import user model for participant update
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary for events
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured successfully for events');
} catch (error) {
  console.error('❌ Cloudinary configuration error for events:', error);
}

// ✅ List all events (with optional type or search filters)
export const list = async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = {};

    if (type) query.status = type;
    if (search) query.title = { $regex: search, $options: "i" };

    const events = await Event.find(query).sort({ date: 1 }).lean();
    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get single event details
export const get = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create event (only Admin)
export const create = async (req, res) => {
  try {
    const user = req.user; // assume middleware adds req.user
    if (!user || user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const event = await Event.create(req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update event (Admin only)
export const update = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete event (Admin only)
export const remove = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Register for event (Member)
export const registerForEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    // Optional capacity check
    if (
      event.maxAttendees &&
      event.currentAttendees >= event.maxAttendees
    ) {
      return res.status(400).json({ success: false, message: "Event full" });
    }

    // Add to user's eventsParticipated if not already added
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.eventsParticipated.includes(event.title)) {
      user.eventsParticipated.push(event.title);
      await user.save();
    }

    // Increment event currentAttendees
    event.currentAttendees = (event.currentAttendees || 0) + 1;
    await event.save();

    res.json({
      success: true,
      message: "Successfully registered for event",
      data: { event, user },
    });
  } catch (err) {
    console.error("Error registering for event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Toggle registration link (Admin only)
export const toggleRegistration = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    event.registrationLink = event.registrationLink ? "" : req.body.registrationLink || "";
    await event.save();

    res.json({
      success: true,
      message: event.registrationLink ? "Registration activated" : "Registration deactivated",
      data: event,
    });
  } catch (err) {
    console.error("Error toggling registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Upload event image (Admin only) - Enhanced version matching Photos controller
export const uploadImage = async (req, res) => {
  console.log('📤 Event image upload request received');
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

    // Validate user authentication
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ success: false, message: 'User not authenticated. Please log in.' });
    }

    // Check admin role
    if (req.user.role !== 'admin') {
      console.log('❌ User is not admin:', req.user.role);
      return res.status(403).json({ success: false, message: 'Admin access required for image upload.' });
    }

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

    // Validate file size (max 5MB for events)
    if (req.file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', req.file.size);
      return res.status(400).json({ success: false, message: 'File size must be less than 5MB.' });
    }

    console.log('✅ All validations passed, uploading to Cloudinary...');

    // Create upload stream (matching Photos controller pattern)
    const bufferStream = streamifier.createReadStream(req.file.buffer);
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'events',
            transformation: [
              { width: 800, height: 600, crop: 'limit', quality: 'auto:good' }
            ],
            resource_type: 'auto'
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
    
    const imageUrl = result.secure_url;
    
    console.log('✅ Event image uploaded successfully:', imageUrl);
    
    // Return success response (matching Photos controller structure)
    res.json({
      success: true,
      data: { imageUrl },
      message: 'Event image uploaded successfully!'
    });

  } catch (error) {
    console.error('💥 Event image upload error details:', {
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
