import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>DivClub</h2>
          <p>Building the Future, One Div at a Time 🚀</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <h3>Explore</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <ul>
              <li><a href="/events">Events</a></li>
              <li><a href="/">Tutorials</a></li>
              <li><a href="/">CEC</a></li>
              <li><a href="/engineering">Engineering</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="https://whatsapp.com/channel/0029VavGXqC3gvWcouPNqc1l" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.linkedin.com/company/div-techclub/ " target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="mailto:divfoundation958@gmail.com">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DivClub — All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
