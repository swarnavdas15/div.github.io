import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admindasboard.css";

const Engineering = ({ openLogin, openRegistration }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  // Resource items with access control
  const resources = [
    {
      title: "📚 Notes",
      description: "Comprehensive study notes for all subjects",
      link: "https://drive.google.com/drive/folders/1S6xiMmgRbz1qQ_RLAkwrFZvnfYZ4R01u?usp=drive_link",
      access: "members",
      icon: "📚",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "📝 Mid Sem PYQ",
      description: "Previous year question papers for mid-semester exams",
      link: "https://drive.google.com/drive/folders/1HYt1j9fVDyNzXuxdtYOhARPnkxPSJ-Ym?usp=drive_link",
      access: "public",
      icon: "📝",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "📄 Sem PYQ",
      description: "Previous year question papers for semester-end exams",
      link: "https://drive.google.com/drive/folders/1I3jwi4gNFwEXjKOxD87nWbn3gOCQRW8Z?usp=drive_link",
      access: "public",
      icon: "📄",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: "🧪 Practicals",
      description: "Lab manuals and practical experiment guides",
      link: "#practicals",
      access: "members",
      icon: "🧪",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      title: "📋 Assignments",
      description: "Assignment templates and submission guidelines",
      link: "#assignments",
      access: "members",
      icon: "📋",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ];

  const handleResourceClick = (resource) => {
    if (resource.access === "members" && !user) {
      // Redirect to login if not authenticated for member-only resources
      if (confirm("This resource is available for members only. Do you want to login?")) {
        if (openLogin) {
          openLogin();
        } else {
          navigate("/login");
        }
      }
      return;
    }

    // Open the link directly for all resources
    if (resource.link && resource.link !== "#") {
      window.open(resource.link, '_blank');
      return;
    }

    // For placeholder links, show development message
    alert(`${resource.title} section is under development. Please check back soon!`);
  };

  const handleGotoButtonClick = (e, resource) => {
    e.stopPropagation(); // Prevent card click event
    
    if (resource.access === "members" && !user) {
      // Redirect to login if not authenticated for member-only resources
      if (confirm("This resource is available for members only. Do you want to login?")) {
        if (openLogin) {
          openLogin();
        } else {
          navigate("/login");
        }
      }
      return;
    }

    // Open the link in a new tab
    window.open(resource.link, '_blank');
  };

  const getAccessBadge = (access) => {
    if (access === "members") {
      return (
        <span style={{
          backgroundColor: "#10b981",
          color: "white",
          padding: "0.25rem 0.5rem",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: "500"
        }}>
          👥 Members Only
        </span>
      );
    } else {
      return (
        <span style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "0.25rem 0.5rem",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: "500"
        }}>
          🌍 Public
        </span>
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `var(--bg-img)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "2rem 0",
      overflowX: "hidden"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "1rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            🔧 Engineering Resources
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#f8fafc",
            maxWidth: "600px",
            margin: "0 auto",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
          }}>
            Access comprehensive study materials, previous year questions, and practical guides for your engineering journey
          </p>
        </div>

        {/* Welcome Message for Non-Members */}
        {!user && (
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "3rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>
              🎓 Want Access to All Resources?
            </h3>
            <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
              Some resources are exclusive to our members. Join our community to get full access to all study materials.
            </p>
            <button
              onClick={() => openRegistration && openRegistration()}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
              }}
            >
              Join Club
            </button>
          </div>
        )}

        {/* Resources Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {resources.map((resource, index) => (
            <div
              key={index}
              onClick={() => handleResourceClick(resource)}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-8px)";
                e.target.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* Background Gradient */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: resource.color
              }}></div>

              {/* Access Badge */}
              <div style={{
                position: "absolute",
                top: "1rem",
                right: "1rem"
              }}>
                {getAccessBadge(resource.access)}
              </div>

              {/* Content */}
              <div style={{ marginTop: "1rem" }}>
                <div style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  textAlign: "center"
                }}>
                  {resource.icon}
                </div>
                
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                  textAlign: "center"
                }}>
                  {resource.title}
                </h3>
                
                <p style={{
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem"
                }}>
                  {resource.description}
                </p>

                {/* Goto Button for all resources */}
                <button
                  onClick={(e) => handleGotoButtonClick(e, resource)}
                  style={{
                    width: "100%",
                    backgroundColor: resource.title === "📚 Notes" ? "#3b82f6" :
                                   resource.title === "📝 Mid Sem PYQ" ? "#8b5cf6" :
                                   resource.title === "📄 Sem PYQ" ? "#06b6d4" :
                                   resource.title === "🧪 Practicals" ? "#10b981" :
                                   resource.title === "📋 Assignments" ? "#f59e0b" : "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    marginTop: "0.5rem"
                  }}
                  onMouseOver={(e) => {
                    const colors = {
                      "📚 Notes": "#2563eb",
                      "📝 Mid Sem PYQ": "#7c3aed",
                      "📄 Sem PYQ": "#0891b2",
                      "🧪 Practicals": "#059669",
                      "📋 Assignments": "#d97706"
                    };
                    e.target.style.backgroundColor = colors[resource.title] || "#2563eb";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    const colors = {
                      "📚 Notes": "#3b82f6",
                      "📝 Mid Sem PYQ": "#8b5cf6",
                      "📄 Sem PYQ": "#06b6d4",
                      "🧪 Practicals": "#10b981",
                      "📋 Assignments": "#f59e0b"
                    };
                    e.target.style.backgroundColor = colors[resource.title] || "#3b82f6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🚀 {resource.title === "📚 Notes" ? "Go to Notes" :
                      resource.title === "📝 Mid Sem PYQ" ? "Go to Mid Sem PYQ" :
                      resource.title === "📄 Sem PYQ" ? "Go to Sem PYQ" :
                      resource.title === "🧪 Practicals" ? "Go to Practicals" :
                      resource.title === "📋 Assignments" ? "Go to Assignments" : "Go to Resource"}
                </button>
              </div>

              {/* Lock Icon for Member-Only Resources */}
              {resource.access === "members" && !user && (
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "50%",
                  fontSize: "1.5rem"
                }}>
                  🔒
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <h3 style={{
            color: "#1e293b",
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: "600"
          }}>
            📞 Need Help or Have Questions?
          </h3>
          <p style={{
            color: "#4b5563",
            marginBottom: "1.5rem",
            lineHeight: "1.6"
          }}>
            If you're having trouble accessing any resources or need additional study materials,
            don't hesitate to reach out to our team.
          </p>
          <button
            onClick={() => navigate("/#contacts")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#3b82f6";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Engineering;