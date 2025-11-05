import Project from '../models/project.js';

export const list = async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: projects });
};

export const get = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: project });
};

export const create = async (req, res) => {
  console.log('Create project data received:', req.body);
  
  const obj = req.body;
  const p = await Project.create(obj);
  console.log('Project created in database:', {
    id: p._id,
    title: p.title
  });
  res.json({ success: true, data: p });
};

export const update = async (req, res) => {
  const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: p });
};

export const remove = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export default { list, get, create, update, remove };