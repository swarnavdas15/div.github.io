import React from "react";

const EventModal = ({ event, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <img src={event.imageUrl} alt={event.title} />
        <h3>{event.title}</h3>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>{event.description}</p>

        <div className="modal-actions">
          <a href={event.registrationLink} target="_blank" rel="noreferrer">
            📝 Register
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Event link copied!");
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
