// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import "../styles/navbar.css";

const Navbar = ({
  openRegistration,
  openLogin,
  currentPage,
  openMemberDashboard,
  openAdminDashboard,
  user,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Projects", href: "#projects" },
  ];

  const resourcesLinks = [
    { name: "Engineering Resources", href: "/engineering" },
    { name: "Blogs", href: "#blogs" },
  ];

  const handleNavigationClick = (href) => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    
    // Check if it's a hash link (section on same page)
    if (href.startsWith("#")) {
      const hash = href.substring(1);
      const section = document.getElementById(hash);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      // It's a route link, navigate to it
      navigate(href);
    }
  };

  // ✅ role-based dashboard redirection
  const handleDashboard = () => {
    if (!user) {
      console.log("No user found");
      return;
    }
    console.log("User role:", user.role);
    console.log("openAdminDashboard function:", typeof openAdminDashboard);
    console.log("openMemberDashboard function:", typeof openMemberDashboard);
    
    if (user.role === "admin") {
      // Instead of navigate, trigger popup
      if (openAdminDashboard) {
        console.log("Calling openAdminDashboard");
        openAdminDashboard();
      } else {
        console.log("openAdminDashboard function not available");
      }
    } else {
      // Instead of navigate, trigger popup
      if (openMemberDashboard) {
        console.log("Calling openMemberDashboard");
        openMemberDashboard();
      } else {
        console.log("openMemberDashboard function not available");
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback to direct localStorage operations
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
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
              <>
                <button className="join-btn" onClick={handleDashboard}>
                  {user.role === "admin" ? "Admin Dashboard" : "Member Dashboard"}
                </button>
                <button className="join-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
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
            <>
              <button
                className="join-btn full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleDashboard();
                }}
              >
                {user.role === "admin" ? "Admin Dashboard" : "Member Dashboard"}
              </button>
              <button
                className="join-btn full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </>
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
