// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = ({ openRegistration, openLogin, openDashboard, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Replace this with your actual user authentication logic
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    // Example: simulate user login (replace with real auth later)
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Projects", href: "#projects" },
  ];

  const resourcesLinks = [
    { name: "Blogs", href: "#blogs" },
    { name: "Enhanced Resources", href: "#resources" },
  ];

  const handleNavigationClick = (href) => {
    const hash = href.substring(1);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    // Optionally scroll into view
    const section = document.getElementById(hash);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`menu-desktop ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="text-sec">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link ${currentPage === link.href.substring(1) ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigationClick(link.href);
                }}
              >
                {link.name}
              </a>
            ))}

            <div
              className="dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="dropdown-btn">
                Resources <span className="chevron">&#9662;</span>
              </button>
              <div className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
                {resourcesLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigationClick(link.href);
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="btn-sec">
            {user ? (
              <button className="join-btn" onClick={openDashboard}>
                Dashboard
              </button>
            ) : (
              <>
                <button className="join-btn" onClick={openRegistration}>
                  Join Club
                </button>
                <button className="join-btn" onClick={openLogin}>
                  Member Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="menu-mobile">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`nav-link ${currentPage === link.href.substring(1) ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigationClick(link.href);
              }}
            >
              {link.name}
            </a>
          ))}

          <div className="mobile-resources">
            <p className="resource-heading">Resources</p>
            {resourcesLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="resource-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigationClick(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {user ? (
            <button
              className="join-btn full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openDashboard();
              }}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                className="join-btn full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openRegistration();
                }}
              >
                Join Club
              </button>
              <button
                className="join-btn full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLogin();
                }}
              >
                Member Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
