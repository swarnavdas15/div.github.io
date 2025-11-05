import User from "../models/User.js";

// ✅ Get member info
export const getMemberInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info" });
  }
};

// ✅ Update avatar
export const updateAvatar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { avatar: req.body.avatar });
    res.json({ message: "Avatar updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar" });
  }
};

// ✅ Fetch messages sent by admin
export const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("messages");
    res.json(user.messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
