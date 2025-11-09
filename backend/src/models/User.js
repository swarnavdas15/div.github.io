import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.provider; } },
    collegeName: { type: String },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    avatar: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    messages: [{
      sender: { type: String, required: true },
      subject: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    eventsParticipated: [{ type: String }],
    // OAuth fields
    provider: { type: String, enum: [null, 'google', 'github', 'linkedin'], default: null },
    providerId: { type: String, default: null },
  },
  { timestamps: true }
);

// password hashing before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
