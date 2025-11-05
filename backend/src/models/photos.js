import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  uploaderId: String, // store user id if you add auth
  uploaderName: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of user IDs who liked this photo
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', PhotoSchema);
export default Photo;
export { Photo };
