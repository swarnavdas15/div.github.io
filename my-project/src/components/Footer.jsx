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
          </ul>
          <ul>
             <li><a href="/contact">Contact</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/engineering">Engineering</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="mailto:example@email.com">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-x-twitter"></i>
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
