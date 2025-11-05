import React from "react";

const NotificationPopup = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "success" // success, error, warning, info
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          gradient: "linear-gradient(135deg, #10b981, #059669)",
          icon: "✅",
          titleColor: "#065f46"
        };
      case "error":
        return {
          gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
          icon: "❌",
          titleColor: "#991b1b"
        };
      case "warning":
        return {
          gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          icon: "⚠️",
          titleColor: "#92400e"
        };
      case "info":
        return {
          gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          icon: "ℹ️",
          titleColor: "#1e40af"
        };
      default:
        return {
          gradient: "linear-gradient(135deg, #10b981, #059669)",
          icon: "✅",
          titleColor: "#065f46"
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header" style={{ background: typeConfig.gradient }}>
          <div className="notification-icon">
            {typeConfig.icon}
          </div>
          <h3 
            className="notification-title" 
            style={{ color: "white" }}
          >
            {title}
          </h3>
          <button className="notification-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="notification-content">
          <p className="notification-message">{message}</p>
        </div>
        
        <div className="notification-actions">
          <button 
            className="notification-ok-btn"
            style={{ background: typeConfig.gradient }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;