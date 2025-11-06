import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    // Check if hash section exists on current page
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      // If section doesn't exist, navigate to home
      navigate("/");
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background - Using a CSS gradient instead of missing image */}
      <div className="hero-background-gradient" />

      {/* Main Content */}
      <div className="hero-content">
        <div className="as-logo">
          {/* Using text placeholder instead of missing logo image */}
          <div className="logo-placeholder">
            <img src="" alt="" />
          </div>
        </div>

        <h1 className="hero-title">
          WHERE CREATIVITY
          <span className="hero-subtitle"> MEETS INNOVATIONS</span>
        </h1>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="hero-scroll"
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "30px",
          cursor: "pointer",
          textDecoration: "none",
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(5px)";
          e.target.style.opacity = "0.8";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.opacity = "1";
        }}
      >
        ↓
      </button>
    </section>
  );
};

export default Hero;
