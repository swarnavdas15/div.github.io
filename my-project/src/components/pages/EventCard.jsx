import React, { useState } from "react";
import "../../styles/events.css";

const EventCard = ({
  event,
  isAdmin,
  onClick,
  onShare,
  onEdit,
  onDelete,
  onToggleRegistration,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
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

  return (
    <div className="eventpro-card" onClick={onClick} id={`event-${event._id}`}>
      {event.imageUrl && isValidImageUrl(event.imageUrl) && !imageError ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="eventpro-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="eventpro-no-image">
          {event.imageUrl && !isValidImageUrl(event.imageUrl) ? 
            "Invalid Image URL" : 
            "No Image Available"
          }
        </div>
      )}

      <div className="eventpro-card-content">
        <span className="eventpro-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p>
          📅 {formatDate(event.date)} &nbsp; ⏰ {event.time}
        </p>
        <p>📍 {event.location}</p>
        <p className="eventpro-desc">
          {event.description.length > 100
            ? event.description.substring(0, 100) + "..."
            : event.description}
        </p>

        <div className="eventpro-card-actions">
          {/* For normal users */}
          {!isAdmin && (
            <>
              {event.registrationRequired && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eventpro-register-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Register
                </a>
              )}
              <button
                className="eventpro-share-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(event);
                }}
              >
                🔗 Share
              </button>
            </>
          )}

          {/* For admins */}
          {isAdmin && (
            <div className="eventpro-admin-controls">
              <button
                className="eventpro-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
              >
                ✏️ Edit
              </button>

              <button
                className="eventpro-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                🗑 Delete
              </button>

              {event.registrationRequired && (
                <button
                  className="eventpro-deactivate-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRegistration(event._id);
                  }}
                >
                  {event.registrationLink ? "🚫 Deactivate" : "🔗 Activate"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
