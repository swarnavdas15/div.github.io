import Event from "../models/event.js";
import User from "../models/User.js"; // import user model for participant update

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
