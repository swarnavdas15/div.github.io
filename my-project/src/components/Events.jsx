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
  const [dragCounter, setDragCounter] = useState(0);
  
  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const FULL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Debug: Log API configuration
  console.log('🔧 API Config:', {
    API_BASE_URL,
    FULL_API_URL,
    envVar: import.meta.env.VITE_API_URL,
    currentLocation: window.location.origin
  });
 
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
     // Handle different endpoint types
     let url;
     if (endpoint.startsWith('http')) {
       url = endpoint; // Full URL for external requests
     } else if (endpoint.startsWith('/api/')) {
       url = `${API_BASE_URL}${endpoint}`; // Direct API routes
     } else {
       url = `${API_BASE_URL}/api${endpoint}`; // Standard API routes
     }
     
     const config = {
       headers: getAuthHeaders(options.body instanceof FormData ? false : true),
       ...options,
     };
     
     console.log('🌐 API Request:', { method: options.method || 'GET', url });
     
     try {
       const response = await fetch(url, config);
       const data = await response.json();
       
       console.log('📊 API Response:', { status: response.status, data });
       
       if (!response.ok) {
         throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
       }
       
       return data;
     } catch (error) {
       console.error(`❌ API Request failed for ${endpoint}:`, error);
       throw error;
     }
   };
 
   // 🟢 Fetch events from backend
   const fetchEvents = async () => {
     setLoading(true);
     setError(null);
     
     try {
       console.log('📡 Starting to fetch events...');
       const response = await apiRequest('/events');
       console.log('✅ Events fetched successfully:', response);
       setEvents(response.data || []);
     } catch (err) {
       console.error('❌ Fetch events error:', err);
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

   // Test API connection
   const testConnection = async () => {
     try {
       console.log('🔍 Testing API connection...');
       const response = await fetch(`${API_BASE_URL}/api/events`);
       console.log('📡 Connection test response:', { status: response.status, ok: response.ok });
       return response.ok;
     } catch (error) {
       console.error('❌ Connection test failed:', error);
       return false;
     }
   };

   // Run connection test on component mount
   useEffect(() => {
     const checkConnection = async () => {
       const isConnected = await testConnection();
       if (!isConnected) {
         console.warn('⚠️ API connection failed, but continuing...');
       }
     };
     checkConnection();
   }, []);
 
  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Simplified file upload handling (following Photowall pattern)
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

  // Enhanced drag and drop handlers with proper counter
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    if (dragCounter === 0) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setDragOver(false);
      }
      return newCounter;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragCounter(0);
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    console.log('🎯 Files dropped:', files.length);
    
    if (files && files.length > 0) {
      const file = files[0];
      console.log('📄 Dropped file:', file.name, file.type, file.size);
      
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
        message: `${file.name} has been added successfully!`,
        type: "success"
      });
    }
  };

  // Simplified image upload (following Photowall pattern)
  const uploadImageToCloudinary = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const uploadUrl = `${FULL_API_URL}/api/events/upload-image`;
      console.log('🖼️ Uploading image to:', uploadUrl);
      
      const response = await fetch(uploadUrl, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data;
    } catch (error) {
      console.error('💥 Upload error:', error);
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

  // Simplified event creation (following Photowall pattern)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation (simplified)
    if (!newEvent.title.trim()) {
      setNotification({
        isOpen: true,
        title: "Validation Error",
        message: "Please enter an event title.",
        type: "warning"
      });
      return;
    }

    if (!newEvent.date) {
      setNotification({
        isOpen: true,
        title: "Validation Error",
        message: "Please select an event date.",
        type: "warning"
      });
      return;
    }

    setUploading(true);
    
    try {
      console.log('🚀 Starting event creation process...');
      console.log('📝 Event data:', newEvent);
      
      // Handle image upload if new file is selected
      let processedData = { ...newEvent };
      
      if (newEvent.imageFile) {
        console.log('📋 Creating FormData for image upload...');
        const formData = new FormData();
        formData.append('image', newEvent.imageFile);
        
        console.log('📤 Uploading image...');
        const uploadResult = await uploadImageToCloudinary(formData);
        
        if (uploadResult.success) {
          processedData.imageUrl = uploadResult.data.imageUrl;
        } else {
          throw new Error(uploadResult.message || 'Failed to upload image');
        }
      }
      
      // Remove imageFile from processed data
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
          message: `Event ${newEvent._id ? "updated" : "created"} successfully!`,
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
      } else {
        throw new Error(response.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('💥 Event creation error:', error);
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

      {/* Add/Edit Event Modal */}
      {showForm && isAdmin && (
        <div className="eventpro-modal-overlay" onClick={(e) => e.target.classList.contains("eventpro-modal-overlay") && setShowForm(false)}>
          <div className="eventpro-form">
            <div className="eventpro-form-header">
              <div className="eventpro-form-header-icon">📅</div>
              <h3>{newEvent._id ? "Edit Event" : "Add New Event"}</h3>
              <button
                className="eventpro-form-close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="eventpro-form-container">
              <form onSubmit={handleSubmit}>
                
                {/* Event Basic Information Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-field">
                    <label htmlFor="title">Event Title *</label>
                    <div className="input-wrapper">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter event title"
                        value={newEvent.title}
                        onChange={handleInput}
                        required
                      />
                      <span className="input-icon">📝</span>
                    </div>
                    <div className="input-help">Choose a compelling title for your event</div>
                  </div>
                </div>

                {/* Event Details Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-grid">
                    <div className="eventpro-form-field">
                      <label htmlFor="category">Category</label>
                      <div className="input-wrapper">
                        <input
                          id="category"
                          name="category"
                          type="text"
                          placeholder="Event category"
                          value={newEvent.category}
                          onChange={handleInput}
                        />
                        <span className="input-icon">🏷️</span>
                      </div>
                    </div>
                    
                    <div className="eventpro-form-field">
                      <label htmlFor="status">Event Status</label>
                      <div className="input-wrapper">
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
                        <span className="input-icon">📊</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Date and Time Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-grid">
                    <div className="eventpro-form-field">
                      <label htmlFor="date">Event Date *</label>
                      <div className="input-wrapper">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          value={newEvent.date}
                          onChange={handleInput}
                          required
                        />
                        <span className="input-icon">📅</span>
                      </div>
                    </div>
                    
                    <div className="eventpro-form-field">
                      <label htmlFor="time">Event Time</label>
                      <div className="input-wrapper">
                        <input
                          id="time"
                          name="time"
                          type="time"
                          value={newEvent.time}
                          onChange={handleInput}
                        />
                        <span className="input-icon">🕐</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Location and Capacity Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-grid">
                    <div className="eventpro-form-field">
                      <label htmlFor="location">Location</label>
                      <div className="input-wrapper">
                        <input
                          id="location"
                          name="location"
                          type="text"
                          placeholder="Event location"
                          value={newEvent.location}
                          onChange={handleInput}
                        />
                        <span className="input-icon">📍</span>
                      </div>
                    </div>
                    
                    <div className="eventpro-form-field">
                      <label htmlFor="maxAttendees">Max Participants</label>
                      <div className="input-wrapper">
                        <input
                          id="maxAttendees"
                          name="maxAttendees"
                          type="number"
                          placeholder="Maximum attendees"
                          value={newEvent.maxAttendees}
                          onChange={handleInput}
                          min="1"
                        />
                        <span className="input-icon">👥</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Image Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-field">
                    <label htmlFor="eventImage">Event Image</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="eventImage"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="file-input-hidden"
                      />
                      <label htmlFor="eventImage" className="file-upload-label">
                        {!newEvent.imageFile ? (
                          <>
                            <div className="upload-icon">☁️</div>
                            <div className="upload-text">
                              <strong>Click to upload or drag and drop</strong>
                              <span>PNG, JPG, GIF, WebP up to 5MB</span>
                            </div>
                            <div className="upload-requirements">Maximum file size: 5MB</div>
                          </>
                        ) : (
                          <div className="image-preview-modern">
                            <img
                              src={URL.createObjectURL(newEvent.imageFile)}
                              alt="Event preview"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                removeImageFile();
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="input-help">Add a compelling image to attract attendees</div>
                  </div>
                </div>

                {/* Event Description Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-field">
                    <label htmlFor="description">Description</label>
                    <div className="input-wrapper">
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Describe your event details, agenda, and any important information..."
                        value={newEvent.description}
                        onChange={handleInput}
                        rows="4"
                      />
                      <span className="input-icon textarea-icon">💭</span>
                    </div>
                    <div className="input-help">Tell attendees what to expect at your event</div>
                  </div>
                </div>

                {/* Registration Link Section */}
                <div className="eventpro-form-section">
                  <div className="eventpro-form-field">
                    <label htmlFor="registrationLink">Registration Link</label>
                    <div className="input-wrapper">
                      <input
                        id="registrationLink"
                        name="registrationLink"
                        type="url"
                        placeholder="https://registration-link.com"
                        value={newEvent.registrationLink}
                        onChange={handleInput}
                      />
                      <span className="input-icon">🔗</span>
                    </div>
                    <div className="input-help">Provide a link for event registration (optional)</div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="eventpro-form-actions">
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="event-form-uploading-spinner"></div>
                        {newEvent._id ? "Updating Event..." : "Creating Event..."}
                      </>
                    ) : (
                      newEvent._id ? "📤 Update Event" : "🎉 Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
