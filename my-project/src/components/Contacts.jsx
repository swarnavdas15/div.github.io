import React, { useState } from "react";
import "../styles/contacts.css";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // Backend API connection (add later)
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(formData) });

      setTimeout(() => {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }, 1000);
    } catch (error) {
      setStatus("❌ Failed to send message. Try again later.");
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
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="btn-submit">Send Message</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
