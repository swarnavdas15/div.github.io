import React, { useState, useEffect, useMemo } from "react";
import "../styles/events.css";

const Events = ({ currentUser }) => {
  const defaultConfig = {
    section_title: "Tech Club Events",
    section_subtitle: "Discover and join our exciting tech events",
    upcoming_tab_label: "Upcoming Events",
    past_tab_label: "Past Events",
    register_button_text: "Register Now",
    share_button_text: "Share Event",
    add_event_button_text: "Add New Event",
    edit_event_button_text: "Edit Event",
    delete_event_button_text: "Delete Event",
  };

  // API Configuration
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("date");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    maxAttendees: '',
    registrationActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_URL}/api/events?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount and when search term changes
  useEffect(() => {
    fetchEvents();
  }, [searchTerm]);

  // Handle create/edit form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setUploading(true);
      let imageUrl = editingEvent?.imageUrl || '';

      // Upload image if selected
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);

        const uploadResponse = await fetch(`${API_URL}/api/events/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataImage,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.data.imageUrl;
        }
      }

      const eventData = {
        ...formData,
        imageUrl,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        date: new Date(formData.date).toISOString(),
      };

      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent._id}`
        : `${API_URL}/api/events`;
      
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events
        setShowCreateForm(false);
        setEditingEvent(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          date: '',
          time: '',
          maxAttendees: '',
          registrationActive: true,
        });
        setImageFile(null);
      } else {
        setError(data.message || 'Failed to save event');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    } finally {
      setUploading(false);
    }
  };

  // Handle event registration
  const handleRegister = async (eventId) => {
    if (!currentUser) {
      alert('Please login to register for events');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Successfully registered for the event!');
        await fetchEvents(); // Refresh to update attendee count
      } else {
        alert(data.message || 'Failed to register');
      }
    } catch (err) {
      console.error('Error registering:', err);
      alert('Failed to register for event');
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    if (!isAdmin || !eventToDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/events/${eventToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events
        setShowDeleteModal(false);
        setEventToDelete(null);
      } else {
        setError(data.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  // Start editing event
  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      location: event.location || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '',
      maxAttendees: event.maxAttendees?.toString() || '',
      registrationActive: event.registrationActive,
    });
    setShowCreateForm(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to determine event status based on date
  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    
    // Set time to end of day for event date to consider it upcoming until the end of that day
    eventDateTime.setHours(23, 59, 59, 999);
    
    if (eventDateTime >= now) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        // First apply category filter
        const categoryMatch = categoryFilter === "all" ? true : e.category === categoryFilter;
        
        // Then apply tab filter based on date
        const eventStatus = getEventStatus(e.date);
        const tabMatch = activeTab === "all" ? true : eventStatus === activeTab;
        
        return categoryMatch && tabMatch;
      })
      .sort((a, b) => {
        if (sortFilter === "name") return a.title.localeCompare(b.title);
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, categoryFilter, sortFilter, activeTab]);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get event icon
  const getEventIcon = (category) => {
    const icons = {
      workshop: '🤖',
      hackathon: '💻',
      seminar: '🎯',
      competition: '🏆',
      meetup: '👥',
      default: '📅'
    };
    return icons[category] || icons.default;
  };

  // Loading state
  if (loading) {
    return (
      <div className="events-container">
        <div className="events-header">
          <h1>{defaultConfig.section_title}</h1>
          <p>{defaultConfig.section_subtitle}</p>
        </div>
        <div className="events-loading">
          <div className="events-loading-spinner">⏳</div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="events" className="events-container">
      {/* Header */}
      <div className="events-header">
        <h1>{defaultConfig.section_title}</h1>
        <p>{defaultConfig.section_subtitle}</p>
        {isAdmin && (
          <button 
            className="events-btn events-btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ {defaultConfig.add_event_button_text}
          </button>
        )}
      </div>

      {error && (
        <div className="events-error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="events-controls">
        {/* Tabs */}
        <div className="events-tabs">
          <button
            className={`events-tab ${activeTab === "upcoming" ? "events-tab-active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            {defaultConfig.upcoming_tab_label}
          </button>
          <button
            className={`events-tab ${activeTab === "past" ? "events-tab-active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            {defaultConfig.past_tab_label}
          </button>
          <button
            className={`events-tab ${activeTab === "all" ? "events-tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Events
          </button>
        </div>

        {/* Search + Filters */}
        <div className="events-search-filter">
          <div className="events-search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="events-search-icon">🔍</span>
          </div>

          <div className="events-filter-group">
            <select
              className="events-filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
              <option value="meetup">Meetup</option>
            </select>

            <select
              className="events-filter-select"
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid-container">
        {filteredEvents.length ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="events-card"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="events-card-image">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  getEventIcon(event.category)
                )}
              </div>
              
              {isAdmin && (
                <div className="events-admin-controls">
                  <button 
                    className="events-admin-btn edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(event);
                    }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="events-admin-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventToDelete(event);
                      setShowDeleteModal(true);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              )}

              <span className={`events-status-badge events-${getEventStatus(event.date)}`}>
                {getEventStatus(event.date) === "upcoming" ? "Upcoming" : "Past"}
              </span>
              
              <div className="events-card-content">
                <span className="events-category-tag">{event.category}</span>
                <h3 className="events-card-title">{event.title}</h3>
                <p className="events-card-description">{event.description}</p>
                <div className="events-card-meta">
                  <div className="events-meta-item">📅 {formatDate(event.date)}</div>
                  {event.time && <div className="events-meta-item">🕐 {event.time}</div>}
                  <div className="events-meta-item">📍 {event.location}</div>
                  {event.maxAttendees && (
                    <div className="events-meta-item">👥 {event.currentAttendees || 0}/{event.maxAttendees}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="events-no-results">
            <div className="events-no-results-icon">📅</div>
            <div className="events-no-results-text">No events found</div>
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {showCreateForm && isAdmin && (
        <div className="events-modal-overlay events-modal-active" onClick={() => setShowCreateForm(false)}>
          <div className="events-modal events-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="events-modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button
                className="events-modal-close"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="events-form">
              <div className="events-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="events-form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="events-form-row">
                <div className="events-form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                
                <div className="events-form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="events-form-row">
                <div className="events-form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="events-form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM - 5:00 PM"
                  />
                </div>
              </div>
              
              <div className="events-form-row">
                <div className="events-form-group">
                  <label>Max Attendees</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                
                <div className="events-form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="registrationActive"
                      checked={formData.registrationActive}
                      onChange={handleInputChange}
                    />
                    Registration Active
                  </label>
                </div>
              </div>
              
              <div className="events-form-group">
                <label>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              
              <div className="events-form-actions">
                <button 
                  type="button" 
                  className="events-btn events-btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="events-btn events-btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="events-modal-overlay events-modal-active" onClick={() => setSelectedEvent(null)}>
          <div className="events-modal" onClick={(e) => e.stopPropagation()}>
            <div className="events-modal-header">
              <div className="events-modal-title-icon">
                {selectedEvent.imageUrl ? (
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px'}} />
                ) : (
                  getEventIcon(selectedEvent.category)
                )}
              </div>
              <button
                className="events-modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="events-modal-body">
              <span className="events-modal-category">{selectedEvent.category}</span>
              <h2 className="events-modal-title">{selectedEvent.title}</h2>
              <div className="events-modal-meta">
                <div className="events-modal-meta-item">📅 {formatDate(selectedEvent.date)}</div>
                {selectedEvent.time && <div className="events-modal-meta-item">🕐 {selectedEvent.time}</div>}
                <div className="events-modal-meta-item">📍 {selectedEvent.location}</div>
                {selectedEvent.maxAttendees && (
                  <div className="events-modal-meta-item">👥 {selectedEvent.currentAttendees || 0}/{selectedEvent.maxAttendees}</div>
                )}
              </div>
              <p className="events-modal-description">{selectedEvent.description}</p>
              <div className="events-modal-actions">
                {selectedEvent.registrationActive && (
                  <button 
                    className="events-btn events-btn-primary"
                    onClick={() => handleRegister(selectedEvent._id)}
                  >
                    ✓ {defaultConfig.register_button_text}
                  </button>
                )}
                <button className="events-btn events-btn-secondary">
                  🔗 {defaultConfig.share_button_text}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="events-modal-overlay events-modal-active" onClick={() => setShowDeleteModal(false)}>
          <div className="events-modal" onClick={(e) => e.stopPropagation()}>
            <div className="events-modal-header">
              <h2>Confirm Deletion</h2>
              <button
                className="events-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="events-modal-body">
              <p>Are you sure you want to delete "{eventToDelete?.title}"?</p>
              <div className="events-modal-actions">
                <button 
                  className="events-btn events-btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="events-btn events-btn-primary"
                  onClick={handleDelete}
                  style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'}}
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
