import React from "react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          confirmGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
          confirmHover: "linear-gradient(135deg, #dc2626, #b91c1c)",
          icon: "⚠️"
        };
      case "warning":
        return {
          confirmGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          confirmHover: "linear-gradient(135deg, #d97706, #b45309)",
          icon: "⚡"
        };
      case "info":
        return {
          confirmGradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          confirmHover: "linear-gradient(135deg, #1d4ed8, #1e40af)",
          icon: "ℹ️"
        };
      default:
        return {
          confirmGradient: "linear-gradient(135deg, #10b981, #059669)",
          confirmHover: "linear-gradient(135deg, #059669, #047857)",
          icon: "✅"
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="confirmation-icon">
            {typeStyles.icon}
          </div>
          <h3 className="confirmation-title">{title}</h3>
          <button className="confirmation-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="confirmation-content">
          <p className="confirmation-message">{message}</p>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="confirmation-cancel-btn"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="confirmation-confirm-btn"
            onClick={onConfirm}
            style={{
              background: typeStyles.confirmGradient,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = typeStyles.confirmHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = typeStyles.confirmGradient;
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;