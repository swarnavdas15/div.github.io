// src/pages/Login.jsx
import React, { useState } from 'react';
import '../styles/registration.css';

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
      if (data.user.role === 'admin') {
        window.location.hash = '#admin';
      } else {
        window.location.hash = '#member';
      }

      // Optionally notify parent (Navbar)
      if (onLoginSuccess) onLoginSuccess(data.user);

      if (isModal && closeModal) closeModal();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login" className="login-page">
      <div className="registration-container">
        <div className="registration-image">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
            alt="Login"
          />
        </div>

        <div className="registration-box">
          {isModal && <button className="close-login-modal" onClick={closeModal}>X</button>}
          <div className="registration-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account.</p>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider"><span>Or continue with</span></div>

          <div className="social-buttons">
            <button className="social-btn google" onClick={() => alert('Google login coming soon')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
            </button>
            <button className="social-btn github" onClick={() => alert('GitHub login coming soon')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
            </button>
            <button className="social-btn linkedin" onClick={() => alert('LinkedIn login coming soon')}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" />
            </button>
          </div>

          <p className="login-link">
            Don’t have an account?{' '}
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

          <p className="terms">
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
