import mongoose from "mongoose" ;

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: [String],
  developer: String,
  gitLink: String,
  gmailLink: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", ProjectSchema);
