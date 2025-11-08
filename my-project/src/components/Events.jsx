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
    imageFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
   // API Configuration
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   const FULL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
 
   // Get authentication headers
   const getAuthHeaders = (includeContentType = true) => {
     const token = localStorage.getItem("token");
     const headers = {};
     
     if (includeContentType) {
       headers["Content-Type"] = "application/json";
     }
     
     if (token) {
       headers["Authorization"] = `Bearer ${token}`;
     }
     
     return headers;
   };
 
   // API request helper
   const apiRequest = async (endpoint, options = {}) => {
     const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
     const config = {
       headers: getAuthHeaders(options.body instanceof FormData ? false : true),
       ...options,
     };
     
     try {
       const response = await fetch(url, config);
       const data = await response.json();
       
       if (!response.ok) {
         throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
       }
       
       return data;
     } catch (error) {
       console.error(`API Request failed for ${endpoint}:`, error);
       throw error;
     }
   };
 
   // 🟢 Fetch events from backend
   const fetchEvents = async () => {
     setLoading(true);
     setError(null);
     
     try {
       const response = await apiRequest('/events');
       setEvents(response.data || []);
     } catch (err) {
       setError(err.message);
       setEvents([]);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchEvents();
   }, []);
 
   // Retry function with consistent pattern
   const handleRetry = () => {
     fetchEvents();
   };
 
  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // File upload handling
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setNotification({
        isOpen: true,
        title: "Invalid File",
        message: "Please select a valid image file (JPG, PNG, GIF, WebP).",
        type: "error"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        isOpen: true,
        title: "File Too Large",
        message: "Image file must be less than 5MB in size.",
        type: "error"
      });
      return;
    }
    
    setNewEvent((prev) => ({ ...prev, imageFile: file }));
  };

  // Drag and drop handling
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragOver to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file || !file.type.startsWith("image/")) {
        setNotification({
          isOpen: true,
          title: "Invalid File",
          message: "Please drop a valid image file (JPG, PNG, GIF, WebP).",
          type: "error"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          isOpen: true,
          title: "File Too Large",
          message: "Image file must be less than 5MB in size.",
          type: "error"
        });
        return;
      }
      
      setNewEvent((prev) => ({ ...prev, imageFile: file }));
      setNotification({
        isOpen: true,
        title: "Image Added",
        message: "Image file has been added successfully!",
        type: "success"
      });
    }
  };

  // Image upload to Cloudinary via backend
  const uploadImageToCloudinary = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`${FULL_API_URL}/api/events/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  // Remove uploaded image
  const removeImageFile = () => {
    setNewEvent((prev) => ({ ...prev, imageFile: null, imageUrl: "" }));
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

    setUploading(true);
    
    try {
      let processedData = { ...newEvent };
      
      // Handle image upload if new file is selected
      if (newEvent.imageFile) {
        setNotification({
          isOpen: true,
          title: "Uploading Image",
          message: "Please wait while we upload the image...",
          type: "info"
        });

        const formData = new FormData();
        formData.append('image', newEvent.imageFile);
        
        const uploadResult = await uploadImageToCloudinary(formData);
        
        if (uploadResult.success) {
          processedData.imageUrl = uploadResult.data.imageUrl;
        } else {
          throw new Error(uploadResult.message || 'Failed to upload image');
        }
      }
      
      // Remove imageFile from processed data before sending to backend
      delete processedData.imageFile;
      
      // Process data for backend
      processedData = processEventData(processedData);
      
      // Use consistent API pattern
      const endpoint = newEvent._id ? `/events/${newEvent._id}` : '/events';
      const method = newEvent._id ? 'PUT' : 'POST';
      
      const response = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(processedData)
      });
      
      if (response.success) {
        setNotification({
          isOpen: true,
          title: "Success",
          message: `Event ${newEvent._id ? "updated" : "added"} successfully`,
          type: "success"
        });
        
        // Refresh events list
        await fetchEvents();
        
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
          imageFile: null
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.message || "Failed to save event. Please try again.",
        type: "error"
      });
    } finally {
      setUploading(false);
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
          const response = await apiRequest(`/events/${id}`, {
            method: 'DELETE'
          });
          
          if (response.success) {
            setEvents(events.filter((e) => e._id !== id));
            setNotification({
              isOpen: true,
              title: "Success",
              message: "Event deleted successfully",
              type: "success"
            });
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          setNotification({
            isOpen: true,
            title: "Error",
            message: error.message || "Failed to delete event. Please try again.",
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
          await apiRequest(`/events/${event._id}`, {
            method: 'PUT',
            body: JSON.stringify(updated)
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
            title: "Error",
            message: error.message || "Failed to deactivate registration. Please try again.",
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
              <label htmlFor="eventImage">Event Image</label>
              <div className={`event-image-upload ${uploading ? 'uploading' : ''}`}>
                <input
                  type="file"
                  id="eventImage"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="event-image-input"
                />
                <label
                  htmlFor="eventImage"
                  className={`event-image-label ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!newEvent.imageFile ? (
                    <div className="event-image-placeholder">
                      <div className="event-image-icon">📷</div>
                      <div className="event-image-text">
                        <strong>Click to upload or drag and drop</strong>
                        <span>PNG, JPG, GIF, WebP up to 5MB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="event-image-preview">
                      <img
                        src={URL.createObjectURL(newEvent.imageFile)}
                        alt="Event preview"
                        className="event-preview-image"
                        onLoad={() => URL.revokeObjectURL(newEvent.imageFile)}
                      />
                      <button
                        type="button"
                        className="event-remove-image"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImageFile();
                        }}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </label>
              </div>
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
            <button type="submit" className="event-form-submit-btn" disabled={uploading}>
              {uploading ? (
                <>
                  <div className="event-form-uploading-spinner"></div>
                  {newEvent._id ? "Updating Event..." : "Creating Event..."}
                </>
              ) : (
                newEvent._id ? "✨ Update Event" : "🎉 Create Event"
              )}
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
                imageFile: null
              });
            }} disabled={uploading}>
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
                  isAdmin={isAdmin}
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
                  onEdit={(event) => {
                    setNewEvent(event);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onToggleRegistration={deactivateLink}
                />
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
