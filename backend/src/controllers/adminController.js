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
    res.json({ message: "Member deactivated", user: member, member: member });
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
  const { to, subject, body } = req.body;
  try {
    let filter;
    
    if (to === "all") {
      // Send to all members
      filter = { role: "member" };
    } else {
      // Send to specific member
      filter = { _id: to, role: "member" };
    }
    
    await User.updateMany(filter, {
      $push: { messages: { sender: "admin", subject, content: body } },
    });
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};

// ✅ Get all messages from all members
export const getAllMessages = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("_id name email messages");
    const allMessages = [];
    
    members.forEach(member => {
      member.messages.forEach(message => {
        allMessages.push({
          _id: message._id,
          memberId: member._id,
          memberName: member.name,
          memberEmail: member.email,
          sender: message.sender,
          subject: message.subject,
          content: message.content,
          createdAt: message.createdAt
        });
      });
    });
    
    // Sort by createdAt descending (newest first)
    allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allMessages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// ✅ Delete specific message from specific member
export const deleteMessage = async (req, res) => {
  const { memberId, messageId } = req.params;
  try {
    const result = await User.updateOne(
      { _id: memberId, role: "member" },
      { $pull: { messages: { _id: messageId } } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" });
  }
};

// ✅ Upload resource for admin
export const uploadResource = async (req, res) => {
  try {
    res.json({ message: "Resource upload endpoint working" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading resource" });
  }
};
