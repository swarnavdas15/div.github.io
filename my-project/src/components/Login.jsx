// src/pages/Login.jsx
import React, { useState } from 'react';
import '../styles/login.css';

export default function Login({ closeModal, openRegistration, isModal = false, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🌐 Send login data to backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // ✅ Save user data (token + role)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 🔥 Role-based dashboard navigation
      if (onLoginSuccess) onLoginSuccess(data.user);

      if (isModal && closeModal) closeModal();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

const handleOAuthLogin = async (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // First check if OAuth is configured by making a test request
    try {
      const testResponse = await fetch(`${apiUrl}/api/auth/${provider}`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      // If we get here without error, OAuth might be configured
      const width = 600;
      const height = 400;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      const popup = window.open(
        `${apiUrl}/api/auth/${provider}`,
        `${provider}_login`,
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // Listen for the popup to close and check if we got a token
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if we have a token in localStorage (user logged in)
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');
          if (token && user) {
            const userData = JSON.parse(user);
            if (onLoginSuccess) onLoginSuccess(userData);
            if (isModal && closeModal) closeModal();
          }
        }
      }, 1000);
    } catch (error) {
      // OAuth is likely not configured
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
      setError(`${providerName} OAuth is not configured. Please contact administrator.`);
    }
  };

  return (
    <div id="login" className="login-page">
      <div className="login-container">
        <div className="login-image">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
            alt="Login"
          />
        </div>

        <div className="login-box">
          {isModal && <button className="close-login-modal" onClick={closeModal}>X</button>}
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <label>
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider"><span>Or continue with</span></div>

          <div className="social-buttons">
            <button className="social-btn google" onClick={() => handleOAuthLogin('google')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
            </button>
            <button className="social-btn github" onClick={() => handleOAuthLogin('github')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
            </button>
            <button className="social-btn linkedin" onClick={() => handleOAuthLogin('linkedin')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" />
            </button>
          </div>

          <p className="log-login-link">
            Don't have an account?{' '}
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                if (isModal && closeModal && openRegistration) {
                  closeModal();
                  openRegistration();
                } else {
                  window.location.hash = '#register';
                }
              }}
            >
              Register here
            </a>
          </p>

          <p className="log-terms">
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset feature coming soon!');
              }}
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
