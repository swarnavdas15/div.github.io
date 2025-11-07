import React, { useState } from "react";
import "../../styles/events.css";

const EventModal = ({ event, onClose }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      
      // Check for common image file extensions
      if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) {
        return true;
      }
      
      // Allow common image hosting services
      const allowedDomains = [
        'unsplash.com',
        'picsum.photos',
        'lorem.space',
        'via.placeholder.com',
        'res.cloudinary.com',  // Cloudinary URLs
        'cloudinary.com',      // Alternative Cloudinary domain
        'i.imgur.com',         // Imgur
        'imgur.com',           // Imgur alternative
        'i.stack.imgur.com'    // Stack Overflow imgur
      ];
      
      // Check if URL contains any of the allowed domains
      return allowedDomains.some(domain => url.includes(domain));
      
    } catch {
      return false;
    }
  };

  const getImageSrc = () => {
    if (event.imageUrl && isValidImageUrl(event.imageUrl) && !imageError) {
      return event.imageUrl;
    }
    return "https://source.unsplash.com/600x400/?event";
  };

  return (
    <div className="eventpro-modal-overlay" onClick={onClose}>
      <div className="eventpro-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Image */}
        <div className="eventpro-modal-header">
          {event.imageUrl && isValidImageUrl(event.imageUrl) && !imageError ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              onError={handleImageError}
            />
          ) : (
            <div className="eventpro-modal-no-image">
              <span>No Image Available</span>
            </div>
          )}
          <span className="eventpro-badge">{event.category}</span>
          <button className="eventpro-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Modal Content */}
        <div className="eventpro-modal-content">
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {formatDate(event.date)}</p>
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
