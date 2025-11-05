import User from "../models/User.js";
import bcrypt from "bcrypt";

// ✅ Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-password");
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members" });
  }
};

// ✅ Get member details
export const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select("-password");
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member details" });
  }
};

// ✅ Deactivate member
export const deactivateMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ message: "Member deactivated", member });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating member" });
  }
};

// ✅ Delete member
export const deleteMember = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member" });
  }
};

// ✅ Change member password
export const changeMemberPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
};

// ✅ Send message to selected or all members
export const sendMessage = async (req, res) => {
  const { content, memberIds } = req.body;
  try {
    const filter = memberIds?.length ? { _id: { $in: memberIds } } : { role: "member" };
    await User.updateMany(filter, {
      $push: { messages: { sender: "admin", content } },
    });
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};
