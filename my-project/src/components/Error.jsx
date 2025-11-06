import React, { useState, useEffect } from 'react';
import '../styles/error.css';

const Error = ({
  type = 'error', // 'error', 'warning', 'info', 'network', 'not-found', 'server'
  title,
  message,
  code,
  details,
  showRetry = true,
  showSupport = true,
  showGoHome = true,
  onRetry,
  onGoHome,
  onSupport,
  suggestions = [],
  actions = []
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const errorConfig = {
    error: {
      icon: '❌',
      bgColor: 'error-bg',
      iconColor: 'error-icon',
      titleColor: 'error-title',
      borderColor: 'error-border'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'warning-bg',
      iconColor: 'warning-icon',
      titleColor: 'warning-title',
      borderColor: 'warning-border'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'info-bg',
      iconColor: 'info-icon',
      titleColor: 'info-title',
      borderColor: 'info-border'
    },
    network: {
      icon: '🌐',
      bgColor: 'network-bg',
      iconColor: 'network-icon',
      titleColor: 'network-title',
      borderColor: 'network-border'
    },
    'not-found': {
      icon: '🔍',
      bgColor: 'notfound-bg',
      iconColor: 'notfound-icon',
      titleColor: 'notfound-title',
      borderColor: 'notfound-border'
    },
    server: {
      icon: '🔧',
      bgColor: 'server-bg',
      iconColor: 'server-icon',
      titleColor: 'server-title',
      borderColor: 'server-border'
    }
  };

  const config = errorConfig[type] || errorConfig.error;
  const defaultTitles = {
    error: 'Oops! Something went wrong',
    warning: 'Hold on!',
    info: 'Heads up!',
    network: 'Connection Issue',
    'not-found': 'Page Not Found',
    server: 'Server Error'
  };

  const defaultMessages = {
    error: 'We encountered an unexpected error. Our team has been notified and is working on a fix.',
    warning: 'There\'s something you should know before proceeding.',
    info: 'Here\'s some important information you should be aware of.',
    network: 'It looks like you\'re having trouble connecting to our servers. Please check your internet connection and try again.',
    'not-found': 'The page you\'re looking for might have been moved, deleted, or you might have entered the wrong URL.',
    server: 'Our servers are currently experiencing issues. We\'re working to resolve this as quickly as possible.'
  };

  const defaultSuggestions = {
    error: [
      'Try refreshing the page',
      'Check if you have the latest version',
      'Contact support if the problem persists'
    ],
    warning: [
      'Review the requirements carefully',
      'Check your input for any errors',
      'Contact support for clarification'
    ],
    info: [
      'Take a moment to read the information',
      'Check related resources for more details',
      'Contact support if you need help'
    ],
    network: [
      'Check your internet connection',
      'Try refreshing the page',
      'Disable VPN if you\'re using one',
      'Try again in a few minutes'
    ],
    'not-found': [
      'Check the URL for typos',
      'Go back to the homepage',
      'Use the navigation menu to find what you need'
    ],
    server: [
      'Wait a few minutes and try again',
      'Check our status page for updates',
      'Contact support if the issue persists'
    ]
  };

  const finalTitle = title || defaultTitles[type] || 'Error';
  const finalMessage = message || defaultMessages[type] || 'An error occurred.';
  const finalSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions[type] || [];

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleSupport = () => {
    if (onSupport) {
      onSupport();
    } else {
      window.open('mailto:divclub@cec.edu?subject=Support Request', '_blank');
    }
  };

  return (
    <div className={`error-container ${config.bgColor} ${animateIn ? 'animate-in' : ''}`}>
      <div className="error-content">
        {/* Error Icon and Code */}
        <div className="error-header">
          <div className={`error-icon ${config.iconColor}`}>
            {config.icon}
          </div>
          {code && (
            <div className="error-code">
              {code}
            </div>
          )}
        </div>

        {/* Error Title and Message */}
        <div className="error-body">
          <h1 className={`error-title ${config.titleColor}`}>
            {finalTitle}
          </h1>
          <p className="error-message">
            {finalMessage}
          </p>

          {/* Additional Details */}
          {details && (
            <div className="error-details">
              <button 
                className="details-toggle"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Details
                <span className="toggle-arrow">{showDetails ? '▲' : '▼'}</span>
              </button>
              
              {showDetails && (
                <div className="details-content">
                  <pre>{details}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {finalSuggestions.length > 0 && (
          <div className="error-suggestions">
            <button 
              className="suggestions-toggle"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              💡 Helpful Tips
              <span className="toggle-arrow">{showSuggestions ? '▲' : '▼'}</span>
            </button>
            
            {showSuggestions && (
              <div className="suggestions-list">
                {finalSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <span className="suggestion-number">{index + 1}</span>
                    <span className="suggestion-text">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="error-actions">
          {showRetry && (
            <button 
              className={`error-btn primary ${config.borderColor}`}
              onClick={handleRetry}
            >
              🔄 Try Again
            </button>
          )}
          
          {showGoHome && (
            <button 
              className="error-btn secondary"
              onClick={handleGoHome}
            >
              🏠 Go Home
            </button>
          )}
          
          {showSupport && (
            <button 
              className="error-btn ghost"
              onClick={handleSupport}
            >
              💬 Contact Support
            </button>
          )}
        </div>

        {/* Custom Actions */}
        {actions.length > 0 && (
          <div className="error-custom-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`error-btn ${action.type || 'secondary'}`}
                onClick={action.onClick}
              >
                {action.icon && <span className="btn-icon">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Error ID for Support */}
        <div className="error-footer">
          <div className="error-id">
            Error ID: {Date.now().toString(36).toUpperCase()}
          </div>
          <div className="error-timestamp">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="error-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-element">💻</div>
        <div className="float-element">⚡</div>
        <div className="float-element">🚀</div>
        <div className="float-element">💡</div>
      </div>
    </div>
  );
};

export default Error;