import React, { useState, useEffect } from 'react';
import '../styles/loading.css';

const Loading = ({ 
  type = 'spinner', // 'spinner', 'dots', 'pulse', 'wave'
  message = 'Loading...', 
  interactive = true,
  showProgress = false,
  progress = 0,
  size = 'medium', // 'small', 'medium', 'large'
  color = 'primary', // 'primary', 'secondary', 'white'
  onCancel = null,
  suggestions = []
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Interactive messages that cycle through
  const messages = interactive ? [
    'Preparing your experience...',
    'Loading amazing content...',
    'Almost ready...',
    'Getting things ready...',
    'Loading with style...',
    'Crafting the perfect experience...'
  ] : [message];

  useEffect(() => {
    if (interactive) {
      const interval = setInterval(() => {
        setCurrentMessage(prevMessage => {
          const currentIndex = messages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [interactive, messages]);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          const next = prev + Math.random() * 15;
          return next >= 100 ? 100 : next;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  const handleRetry = () => {
    if (onCancel) {
      onCancel();
    }
    // Reset progress if available
    if (showProgress) {
      setCurrentProgress(0);
    }
  };

  const renderLoader = () => {
    const sizeClass = `loading-${size}`;
    const colorClass = `loading-${color}`;

    switch (type) {
      case 'spinner':
        return (
          <div className={`spinner ${sizeClass} ${colorClass}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        );

      case 'dots':
        return (
          <div className={`dots-loader ${sizeClass} ${colorClass}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`pulse-loader ${sizeClass} ${colorClass}`}>
            <div className="pulse-wave"></div>
            <div className="pulse-wave"></div>
            <div className="pulse-wave"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`wave-loader ${sizeClass} ${colorClass}`}>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        );

      default:
        return (
          <div className={`spinner ${sizeClass} ${colorClass}`}>
            <div className="spinner-ring"></div>
          </div>
        );
    }
  };

  return (
    <div className="loading-container">
      <div className="loading-content">
        {renderLoader()}
        
        <div className="loading-text">
          <p className="loading-message">{currentMessage}</p>
          
          {showProgress && (
            <div className="loading-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(currentProgress)}%</span>
            </div>
          )}
        </div>

        {interactive && suggestions.length > 0 && (
          <div className="loading-suggestions">
            <button 
              className="suggestions-toggle"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              💡 Quick Tips
            </button>
            
            {showSuggestions && (
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {onCancel && (
          <div className="loading-actions">
            <button className="loading-btn secondary" onClick={handleRetry}>
              🔄 Try Again
            </button>
            {showProgress && currentProgress < 100 && (
              <button className="loading-btn ghost" onClick={onCancel}>
                ⏹️ Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Background animation */}
      <div className="loading-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Loading;