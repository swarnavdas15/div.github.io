import React from "react";
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
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="eventpro-card" onClick={onClick} id={`event-${event._id}`}>
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="eventpro-image"
        />
      ) : (
        <div className="eventpro-no-image">No Image Available</div>
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
