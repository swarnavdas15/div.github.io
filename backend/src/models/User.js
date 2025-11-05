import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    collegeName: { type: String },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    avatar: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    messages: [{ sender: String, content: String, createdAt: { type: Date, default: Date.now } }],
    eventsParticipated: [{ type: String }],
  },
  { timestamps: true }
);

// password: { type: String, required: true },
//     collegeName: { type: String },
//     role: { type: String, enum: ["member", "admin"], default: "member" },
//     avatar: { type: String, default: "" },
//     isActive: { type: Boolean, default: true },
//     messages: [{ sender: String, content: String, createdAt: { type: Date, default: Date.now } }],
//     eventsParticipated: [{ type: String }],
//   },
//   { timestamps: true }
// );

// password hashing before save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
