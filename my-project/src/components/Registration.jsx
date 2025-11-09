import React, { useState } from "react";
import "../styles/registration.css";

export default function Registration({ closeModal, openLogin, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful! You can now log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        collegeName: "",
      });

      setTimeout(() => {
        closeModal?.();
        openLogin?.();
      }, 1000);
    } catch (err) {
      setError(err.message);
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
            closeModal?.();
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
    <div id="register" className="registration-container">
      <div className="registration-image">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
          alt="Registration"
        />
      </div>

      <div className="registration-box">
        <div className="registration-header">
          <button className="close-modal" onClick={closeModal}>
            ×
          </button>
          <h1>Create an Account</h1>
          <p>Get started with your new account.</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <label>
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>

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
            <span>College Name</span>
            <input
              type="text"
              name="collegeName"
              placeholder="Enter your college name"
              value={formData.collegeName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <label>
            <span>Confirm Password</span>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="toggle-password"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
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

        <p className="login-link">
          Already register :{" "}
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              closeModal?.();
              openLogin?.();
            }}
          >
            Login Now
          </a>
        </p>
      </div>
    </div>
  );
}
