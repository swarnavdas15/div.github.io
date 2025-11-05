import React from "react";

const EventModal = ({ event, onClose }) => {
  return (
    <div className="eventpro-modal-overlay" onClick={onClose}>
      <div className="eventpro-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Image */}
        <div className="eventpro-modal-header">
          <img
            src={event.imageUrl || "https://source.unsplash.com/600x400/?event"}
            alt={event.title}
            onError={(e) => {
              e.target.src = "https://source.unsplash.com/600x400/?event";
            }}
          />
          <span className="eventpro-badge">{event.category}</span>
          <button className="eventpro-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Modal Content */}
        <div className="eventpro-modal-content">
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p className="eventpro-description">{event.description}</p>
          
          <div className="eventpro-actions">
            {event.registrationLink ? (
              <a href={event.registrationLink} target="_blank" rel="noreferrer">
                📝 Register Now
              </a>
            ) : (
              <button disabled>🚫 Registration Closed</button>
            )}
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Event link copied!");
            }}>
              🔗 Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
