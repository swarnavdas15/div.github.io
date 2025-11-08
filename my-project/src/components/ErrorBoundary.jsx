import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Always show error details for debugging
      const errorDetails = (
        <details style={{
          textAlign: 'left',
          marginTop: '20px',
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <summary style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#856404'
          }}>
            🔍 Debug Information
          </summary>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            overflow: 'auto',
            maxHeight: '400px',
            textAlign: 'left'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#721c24' }}>Error Message:</strong>
              <pre style={{
                margin: '5px 0',
                whiteSpace: 'pre-wrap',
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '8px',
                borderRadius: '4px'
              }}>
                {this.state.error?.toString() || 'No error message available'}
              </pre>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#721c24' }}>Component Stack:</strong>
              <pre style={{
                margin: '5px 0',
                whiteSpace: 'pre-wrap',
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '8px',
                borderRadius: '4px'
              }}>
                {this.state.errorInfo?.componentStack || 'No component stack available'}
              </pre>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#721c24' }}>Environment Info:</strong>
              <pre style={{
                margin: '5px 0',
                whiteSpace: 'pre-wrap',
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '8px',
                borderRadius: '4px'
              }}>
{`NODE_ENV: ${process.env.NODE_ENV || 'not set'}
VITE_API_URL: ${import.meta.env.VITE_API_URL || 'not set'}
VITE_BACKEND_URL: ${import.meta.env.VITE_BACKEND_URL || 'not set'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
`}
              </pre>
            </div>
          </div>
        </details>
      );

      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            width: '100%'
          }}>
            <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
              🚨 Application Error
            </h2>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              The application encountered an error during initialization. This information will help identify the issue.
            </p>
            
            {errorDetails}
            
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px',
                marginRight: '10px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              🔄 Refresh Page
            </button>
            
            <button
              onClick={() => {
                const logs = {
                  error: this.state.error?.toString(),
                  componentStack: this.state.errorInfo?.componentStack,
                  environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    VITE_API_URL: import.meta.env.VITE_API_URL,
                    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                  }
                };
                console.log('Error Details:', logs);
                alert('Error details have been logged to console. Check browser console for full information.');
              }}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              📋 Log to Console
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;