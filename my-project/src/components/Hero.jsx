import React from "react";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Background */}
      <div
        className="hero-background"
        style={{
          backgroundImage: `url("/assets/herobg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Main Content */}
      <div className="hero-content">
        <div className="as-logo">
          <img src="/assets/logo.jpg" alt="AS Logo" />
          <div className="hero-overlay"></div>
        </div>

        <h1 className="hero-title">
          WHERE CREATIVITY
          <span className="hero-subtitle"> MEETS INNOVATIONS</span>
        </h1>
      </div>

      {/* Scroll Indicator */}
      <a href="#about" className="hero-scroll">
        ↓
      </a>
    </section>
  );
};

export default Hero;
