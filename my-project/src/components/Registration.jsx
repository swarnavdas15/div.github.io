import React, { useState } from "react";
import "../styles/registration.css";

export default function Registration({ closeModal, openLogin }) {
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

        <p className="login-link">
          Already have an account?{" "}
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              closeModal?.();
              openLogin?.();
            }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
