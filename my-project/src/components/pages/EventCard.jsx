import React from "react";

const EventCard = ({ event, onClick, onShare }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="event-card" onClick={onClick} id={`event-${event.id}`}>
      <img src={event.imageUrl} alt={event.title} />
      <div className="event-card-content">
        <h3>{event.title}</h3>
        <p>
          📅 {formatDate(event.date)} &nbsp; ⏰ {event.time}
        </p>
        <p>📍 {event.location}</p>
        <p>
          {event.description.length > 90
            ? event.description.substring(0, 90) + "..."
            : event.description}
        </p>
        <button
          className="share-btn"
          onClick={(e) => {
            e.stopPropagation();
            onShare(event);
          }}
        >
          🔗 Share
        </button>
      </div>
    </div>
  );
};

export default EventCard;
