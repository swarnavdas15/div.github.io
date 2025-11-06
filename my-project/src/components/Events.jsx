import React, { useState, useMemo, useEffect } from "react";
import EventCard from "./pages/EventCard";
import EventModal from "./pages/EventModal";
import ConfirmationModal from "./pages/ConfirmationModal";
import NotificationPopup from "./pages/NotificationPopup";
import Loading from "./Loading";
import Error from "./Error";
import "../styles/events.css";

const Event = ({ isAdmin = false, userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger"
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success"
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    description: "",
    registrationLink: "",
    category: "",
    maxAttendees: "",
    status: "upcoming",
  });

  // 🟢 Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/events`);
        const data = await res.json();
        
        if (res.ok) {
          setEvents(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleRetry = () => {
    const apiUrl = getApiUrl();
    setLoading(true);
    setError(null);
    
    fetch(`${apiUrl}/events`)
      .then((res) => res.json())
      .then((data) => {
        if (res.ok) {
          setEvents(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch events');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Get token for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // Get API base URL
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Process form data for backend compatibility
  const processEventData = (eventData) => {
    const processed = { ...eventData };
    
    // Convert date string to Date object for backend
    if (processed.date) {
      processed.date = new Date(processed.date);
    }
    
    // Convert maxAttendees to number
    if (processed.maxAttendees) {
      processed.maxAttendees = parseInt(processed.maxAttendees) || null;
    }
    
    // Remove _id for new events
    if (!processed._id) {
      delete processed._id;
    }
    
    console.log('Processed event data:', processed);
    return processed;
  };

  // 🟢 Add / Edit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newEvent.title || !newEvent.date) {
      setNotification({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill in at least the title and date fields.",
        type: "warning"
      });
      return;
    }

    const method = newEvent._id ? "PUT" : "POST";
    const apiUrl = getApiUrl();
    const url = newEvent._id
      ? `${apiUrl}/events/${newEvent._id}`
      : `${apiUrl}/events`;
    
    // Process data for backend
    const processedData = processEventData(newEvent);
    
    console.log('Sending data to:', url);
    console.log('Data being sent:', processedData);
    
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(processedData),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setNotification({
          isOpen: true,
          title: "Success",
          message: `Event ${newEvent._id ? "updated" : "added"} successfully`,
          type: "success"
        });
        
        // Refresh events list
        const response = await fetch(`${apiUrl}/events`);
        const eventsData = await response.json();
        setEvents(eventsData.data || []);
        
        setShowForm(false);
        setNewEvent({
          title: "",
          date: "",
          time: "",
          location: "",
          imageUrl: "",
          description: "",
          registrationLink: "",
          category: "",
          maxAttendees: "",
          status: "upcoming",
        });
      } else {
        setNotification({
          isOpen: true,
          title: "Error",
          message: data.message || "Failed to save event",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setNotification({
        isOpen: true,
        title: "Network Error",
        message: `${error.message}. Please check your connection and try again.`,
        type: "error"
      });
    }
  };

  // 🟢 Delete Event
  const handleDelete = async (id) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Event",
      message: "Are you sure you want to delete this event? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const apiUrl = getApiUrl();
          const res = await fetch(`${apiUrl}/events/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          const data = await res.json();
          
          if (data.success) {
            setEvents(events.filter((e) => e._id !== id));
            setNotification({
              isOpen: true,
              title: "Success",
              message: "Event deleted successfully",
              type: "success"
            });
          } else {
            setNotification({
              isOpen: true,
              title: "Error",
              message: data.message || "Failed to delete event",
              type: "error"
            });
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          setNotification({
            isOpen: true,
            title: "Network Error",
            message: "Network error. Please try again.",
            type: "error"
          });
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      type: "danger"
    });
  };

  // 🟢 Deactivate registration link
  const deactivateLink = async (event) => {
    setConfirmationModal({
      isOpen: true,
      title: "Deactivate Registration",
      message: "Are you sure you want to deactivate the registration link for this event? Users will no longer be able to register.",
      onConfirm: async () => {
        const updated = { ...event, registrationLink: "" };
        try {
          const apiUrl = getApiUrl();
          await fetch(`${apiUrl}/events/${event._id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(updated),
          });
          setNotification({
            isOpen: true,
            title: "Success",
            message: "Registration link deactivated!",
            type: "success"
          });
          setEvents((prev) =>
            prev.map((e) => (e._id === event._id ? updated : e))
          );
        } catch (error) {
          console.error("Error deactivating registration:", error);
          setNotification({
            isOpen: true,
            title: "Network Error",
            message: "Network error. Please try again.",
            type: "error"
          });
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      type: "warning"
    });
  };

  // 🟢 Filter + Search
  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let filtered = events.filter((event) => {
      const isUpcoming = event.date >= today;
      const isPast = event.date < today;
      if (activeTab === "upcoming") return isUpcoming;
      if (activeTab === "past") return isPast;
      return true;
    });

    if (filterCategory !== "All") {
      filtered = filtered.filter((e) => e.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [events, activeTab, filterCategory, searchQuery]);

  const categories = ["All", ...new Set(events.map((e) => e.category))];

  return (
    <section id="events" className="eventpro-section">
      <div className="eventpro-header">
        <h2>Events</h2>
        {isAdmin && (
          <button
            className="eventpro-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "➕ Add Event"}
          </button>
        )}
      </div>

      <div className="eventpro-tabs">
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      <div className="eventpro-filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit Event Form */}
      {showForm && isAdmin && (
        <form className="eventpro-form" onSubmit={handleSubmit}>
          <h3>{newEvent._id ? "Edit Event" : "Add Event"}</h3>
          
          <div className="eventpro-form-grid">
            <div className="eventpro-form-field">
              <label htmlFor="title">Event Title</label>
              <input
                id="title"
                name="title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={handleInput}
                required
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                placeholder="Event category"
                value={newEvent.category}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="date">Event Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInput}
                required
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="time">Event Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={newEvent.time}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                placeholder="Event location"
                value={newEvent.location}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="maxAttendees">Max Participants</label>
              <input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                placeholder="Maximum attendees"
                value={newEvent.maxAttendees}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field eventpro-form-full">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={newEvent.imageUrl}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field eventpro-form-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your event details, agenda, and any important information..."
                value={newEvent.description}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field eventpro-form-full">
              <label htmlFor="registrationLink">Registration Link</label>
              <input
                id="registrationLink"
                name="registrationLink"
                placeholder="https://registration-link.com"
                value={newEvent.registrationLink}
                onChange={handleInput}
              />
            </div>
            
            <div className="eventpro-form-field">
              <label htmlFor="status">Event Status</label>
              <select
                id="status"
                name="status"
                value={newEvent.status}
                onChange={handleInput}
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="eventpro-form-actions">
            <button type="submit">
              {newEvent._id ? "✨ Update Event" : "🎉 Create Event"}
            </button>
            <button type="button" onClick={() => {
              setShowForm(false);
              setNewEvent({
                title: "",
                date: "",
                time: "",
                location: "",
                imageUrl: "",
                description: "",
                registrationLink: "",
                category: "",
                maxAttendees: "",
                status: "upcoming",
              });
            }}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading
          type="wave"
          message="Loading events..."
          interactive={true}
          showProgress={true}
          size="medium"
          suggestions={[
            "Events are being fetched from our servers",
            "This usually takes just a moment",
            "We're preparing an amazing experience for you"
          ]}
        />
      ) : error ? (
        <Error
          type="error"
          title="Failed to Load Events"
          message={error}
          onRetry={handleRetry}
          showRetry={true}
          showGoHome={false}
          suggestions={[
            "Check your internet connection",
            "Try refreshing the page",
            "If the problem persists, contact support"
          ]}
        />
      ) : (
        <div className="eventpro-grid">
          {filteredEvents.length === 0 ? (
            <div className="no-events-message">
              <p>No events found.</p>
              {isAdmin && <p>Click "Add Event" to create the first event!</p>}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event._id} className="eventpro-card">
                <EventCard
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  onShare={() => {
                    navigator.clipboard.writeText(window.location.href + `#event-${event._id}`);
                    setNotification({
                      isOpen: true,
                      title: "Link Copied",
                      message: "Event link copied to clipboard!",
                      type: "success"
                    });
                  }}
                />
                {isAdmin && (
                  <div className="eventpro-admin-actions">
                    <button onClick={() => {
                      setNewEvent(event);
                      setShowForm(true);
                    }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(event._id)}>🗑️ Delete</button>
                    <button onClick={() => deactivateLink(event)}>🚫 Deactivate</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          userId={userId}
        />
      )}
      
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText="Confirm"
        cancelText="Cancel"
      />
      
      <NotificationPopup
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </section>
  );
};

export default Event;
