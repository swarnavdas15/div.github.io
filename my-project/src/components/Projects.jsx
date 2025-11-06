import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Error from "./Error";
import "../styles/projects.css";

const Projects = ({ currentUser = null /* pass user object or null */, apiBase = import.meta.env.VITE_API_URL || "/api" }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    techStack: "",
    developer: "",
    gitLink: "",
    gmailLink: "",
    featured: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("info");

  // Admin detection: check if user has admin role
  const isAdmin = Boolean(currentUser && currentUser.role === "admin");

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
      const res = await fetch(`${apiBase || import.meta.env.VITE_API_URL}/projects`, {
        method: "GET",
        headers
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      
      // Handle both formats: { success: true, data: [...] } or direct array
      console.log('Projects API response:', data);
      
      let projects = [];
      if (data && data.success && Array.isArray(data.data)) {
        projects = data.data;
      } else if (Array.isArray(data)) {
        projects = data;
      }
      
      console.log('Processed projects:', projects);
      setProjects(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper to show popups
  const showPopupMessage = (message, type = "info") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProjectForm((p) => ({ ...p, [name]: checked }));
    } else {
      setProjectForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    if (!projectForm.title.trim() || !projectForm.description.trim() || !projectForm.developer.trim()) {
      showPopupMessage("Please fill title, description and developer.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        techStack: projectForm.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        developer: projectForm.developer.trim(),
        gitLink: projectForm.gitLink.trim() || "",
        gmailLink: projectForm.gmailLink.trim() || "",
        featured: !!projectForm.featured,
      };

      console.log('Project creation payload:', payload);

      // POST to backend (replace with actual endpoint)
      const token = localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${apiBase || import.meta.env.VITE_API_URL}/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }

      const created = await res.json();
      console.log('Project created successfully:', created);
      
      showPopupMessage("Project created successfully!", "success");
      // refresh list (or append optimistically)
      await fetchProjects();
      setShowAddModal(false);
      setProjectForm({
        title: "",
        description: "",
        techStack: "",
        developer: "",
        gitLink: "",
        gmailLink: "",
        featured: false,
      });
    } catch (err) {
      console.error("Create project error:", err);
      showPopupMessage(`Failed to create project: ${err.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${apiBase || import.meta.env.VITE_API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      showPopupMessage("Project deleted.", "success");
      await fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);
      showPopupMessage("Failed to delete project.", "error");
    }
  };

  return (
    <div id="projects" className="proj-cont">
      <div className="projects-header">
        <h1>Featured Projects</h1>
        <p>Explore innovative projects from our talented developers</p>

        {isAdmin && (
          <button className="add-project-btn admin-btn" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">🚀</span>
            <span>Add Project</span>
          </button>
        )}
      </div>

      <div className="projects-container">
        {loading ? (
          <Loading
            type="pulse"
            message="Loading amazing projects..."
            interactive={true}
            showProgress={true}
            size="medium"
            suggestions={[
              "Projects are being loaded from our database",
              "Discovering innovative work from our developers",
              "Preparing project showcase for you"
            ]}
          />
        ) : error ? (
          <Error
            type="error"
            title="Failed to Load Projects"
            message={error}
            onRetry={fetchProjects}
            showRetry={true}
            showGoHome={false}
            suggestions={[
              "Check your internet connection",
              "Try refreshing the page",
              "If the problem persists, contact support"
            ]}
          />
        ) : projects.length === 0 ? (
          <div className="no-projects-message">
            <p>No projects available yet.</p>
            {isAdmin && <p>Click "Add Project" to create the first project!</p>}
            {isAdmin && (
              <button className="small-ghost" onClick={fetchProjects}>
                🔄 Refresh Projects
              </button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
              <small style={{ color: '#666' }}>
                Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                {isAdmin && (
                  <button
                    className="small-ghost"
                    onClick={fetchProjects}
                    style={{ marginLeft: '1rem', fontSize: '0.8rem' }}
                  >
                    🔄 Refresh
                  </button>
                )}
              </small>
            </div>
            {projects.map((project) => (
              <div key={project._id || project.id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-links">
                    {project.gitLink && (
                      <a
                        href={project.gitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-icon git-link"
                        title="Open GitHub"
                      >
                        {/* GitHub SVG */}
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}

                    {project.gmailLink && (
                      <a href={`mailto:${project.gmailLink}`} className="link-icon gmail-link" title="Send Email">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </a>
                    )}

                    {isAdmin && (
                      <button
                        className="delete-project-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProject(project._id || project.id, project.title);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                <div className="project-developer">
                  <span>By {project.developer}</span>
                </div>

                <div className="project-tech-stack">
                  {project.techStack && project.techStack.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <p className="project-description">{project.description}</p>

                {project.featured && <div className="featured-badge">⭐ Featured</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="proj-modal-overlay" onClick={(e) => e.target.classList.contains("proj-modal-overlay") && setShowAddModal(false)}>
          <div className="proj-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="proj-modal-header">
              <div className="proj-header-content">
                <div className="proj-icon-wrapper">
                  <div className="proj-header-icon">🚀</div>
                </div>
                <div className="proj-title-section">
                  <h2 className="proj-modal-title">Create New Project</h2>
                  <p className="proj-modal-subtitle">Share your amazing work with the community</p>
                </div>
              </div>
              <button className="proj-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitProject} className="proj-form">
              <div className="proj-form-content">
                <div className="proj-form-row">
                  <div className="proj-form-section proj-section-main">
                    <label className="proj-form-label">Project Title *</label>
                    <input name="title" className="proj-input" value={projectForm.title} onChange={handleInputChange} required />
                  </div>

                  <div className="proj-form-section proj-section-side">
                    <label className="proj-form-label">Developer *</label>
                    <input name="developer" className="proj-input" value={projectForm.developer} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="proj-form-section proj-section-full">
                  <label className="proj-form-label">Description *</label>
                  <textarea name="description" className="proj-input proj-textarea" rows={4} value={projectForm.description} onChange={handleInputChange} required />
                </div>

                <div className="proj-form-row">
                  <div className="proj-form-section proj-section-main">
                    <label className="proj-form-label">Tech Stack (comma separated)</label>
                    <input name="techStack" className="proj-input" value={projectForm.techStack} onChange={handleInputChange} />
                  </div>

                  <div className="proj-form-section proj-section-side">
                    <label className="proj-form-label">GitHub Link</label>
                    <input name="gitLink" className="proj-input" value={projectForm.gitLink} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="proj-form-section proj-section-full">
                  <label className="proj-form-label">Contact Email</label>
                  <input name="gmailLink" type="email" className="proj-input" value={projectForm.gmailLink} onChange={handleInputChange} />
                </div>

                <div className="proj-form-section proj-section-full">
                  <label className="proj-checkbox-label">
                    <input type="checkbox" name="featured" checked={projectForm.featured} onChange={handleInputChange} />
                    <span style={{ marginLeft: 8 }}>Mark as Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="proj-form-actions">
                <button type="button" className="proj-btn secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="proj-btn primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">{popupType === "success" ? "✅" : popupType === "error" ? "❌" : "ℹ️"}</div>
            <div className="popup-message">{popupMessage}</div>
            <button onClick={() => setShowPopup(false)} className="popup-ok">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
