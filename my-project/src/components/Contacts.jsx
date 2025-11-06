import React, { useState } from "react";
import Loading from "./Loading";
import Error from "./Error";
import "../styles/contacts.css";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus("");

    try {
      // Backend API connection
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setError(null);
      } else {
        setError(result.message || "Failed to send message. Try again later.");
        setStatus("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send message. Please check your connection.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Left Info Section */}
        <div className="contact-info">
          <h2>Contact <span>Us</span></h2>
          <p>
            Have questions, ideas, or collaboration requests?  
            We’d love to hear from you!
          </p>

          <div className="contact-details">
            <div><i className="fa-solid fa-location-dot"></i> Chouksey Engineering College, Bilaspur</div>
            <div><i className="fa-solid fa-envelope"></i> divclub@cec.edu</div>
            <div><i className="fa-solid fa-phone"></i> +91 98765 43210</div>
          </div>

          <div className="contact-socials">
            <a href="https://github.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        {/* Right Form Section */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send us a message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          ></textarea>

          {loading ? (
            <Loading
              type="dots"
              message="Sending your message..."
              size="small"
              interactive={false}
            />
          ) : error ? (
            <Error
              type="error"
              title="Message Failed"
              message={error}
              onRetry={handleSubmit}
              showRetry={true}
              showGoHome={false}
              showSupport={false}
            />
          ) : (
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          )}
          
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
