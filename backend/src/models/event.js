// models/event.js
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  location: String,
  date: Date,
  time: String,
  imageUrl: String,
  registrationLink: String,
  registrationActive: { type: Boolean, default: true },
  maxAttendees: Number,
  participants: [{ type: String }], // store user ids (string) - adapt if storing ObjectId refs
  createdBy: { type: String }, // admin id who created (optional)
  status: { type: String, default: "upcoming" }, // upcoming/ongoing/completed/cancelled
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event ? mongoose.models.Event : mongoose.model("Event", EventSchema);
