import React, { useState } from "react";
import EventCard from "./pages/EventCard";
import EventModal from "./pages/EventModal";
import "../styles/events.css";

const Event = ({ isAdmin = false }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "2025-11-15",
      time: "10:00 AM",
      location: "Bangalore",
      imageUrl: "https://source.unsplash.com/600x400/?conference",
      description:
        "Join the most awaited Tech Conference of the year featuring top speakers and workshops.",
      registrationLink: "https://example.com/register",
    },
    {
      id: 2,
      title: "AI Innovation Summit",
      date: "2025-12-01",
      time: "9:30 AM",
      location: "Delhi",
      imageUrl: "https://source.unsplash.com/600x400/?artificial-intelligence",
      description:
        "Explore the future of AI with innovators and researchers from around the world.",
      registrationLink: "https://example.com/ai",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    description: "",
    registrationLink: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return alert("Please fill all fields");
    setEvents((prev) => [
      ...prev,
      { ...newEvent, id: Date.now(), imageUrl: newEvent.imageUrl || "https://source.unsplash.com/600x400/?event" },
    ]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      imageUrl: "",
      description: "",
      registrationLink: "",
    });
    setShowForm(false);
  };

  const handleShare = (event) => {
    navigator.clipboard.writeText(window.location.href + `#event-${event.id}`);
    alert("Event link copied to clipboard!");
  };

  return (
    <section className="events-section">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        {isAdmin && (
          <button
            className="add-event-btn"
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "Cancel" : "➕ Add Event"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="event-form" onSubmit={handleAddEvent}>
          <h3>Add New Event</h3>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInput}
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInput}
          />
          <input
            type="text"
            name="time"
            placeholder="Time (e.g. 10:00 AM)"
            value={newEvent.time}
            onChange={handleInput}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newEvent.location}
            onChange={handleInput}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newEvent.imageUrl}
            onChange={handleInput}
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleInput}
          />
          <input
            type="text"
            name="registrationLink"
            placeholder="Registration Link"
            value={newEvent.registrationLink}
            onChange={handleInput}
          />
          <button type="submit">Create Event</button>
        </form>
      )}

      <div className="event-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => setSelectedEvent(event)}
            onShare={handleShare}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default Event;
