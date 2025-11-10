import React, { useEffect, useState } from "react";
import MemberList from "./MemberList";
import MemberDetail from "./MemberDetail";
import MessagePanel from "./MessagePanel";
import MessageList from "./MessageList";
import ResourceUploader from "./ResourceUploader";
import '../../styles/admindasboard.css';

/**
 * Enhanced Admin Dashboard with Modern UI
 * Features:
 * - Modern card-based layout
 * - Improved navigation
 * - Better user experience
 * - Enhanced visual hierarchy
 */
const AdminDashboard = ({ onClose }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('members');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    recent: 0,
    admins: 0,
    inactive: 0
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load members");
      const data = await res.json();
      const membersList = data.members || data;
      setMembers(membersList);
      
      // Calculate enhanced stats
      const total = membersList.length;
      const active = membersList.filter(m => m.isActive === true).length;
      const inactive = membersList.filter(m => m.isActive === false).length;
      const admins = membersList.filter(m => m.role === 'admin').length;
      const recent = membersList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt > oneWeekAgo;
      }).length;
      
      setStats({ total, active, inactive, admins, recent });
    } catch (err) {
      console.error("Error fetching members:", err);
      alert("Could not load members. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (member) => {
    setSelectedMember(member);
    setActiveSection('member-detail');
  };

  // callbacks for optimistic updates
  const handleMemberUpdated = (updated) => {
    setMembers((prev) => prev.map(m => m._id === updated._id ? updated : m));
    if (selectedMember && selectedMember._id === updated._id) setSelectedMember(updated);
  };

  const handleMemberDeleted = (id) => {
    setMembers((prev) => prev.filter(m => m._id !== id));
    if (selectedMember && selectedMember._id === id) {
      setSelectedMember(null);
      setActiveSection('members');
    }
  };

  return (
    <div className="admin-popup-overlay">
      <div className="admin-popup-content">
        <button className="admin-close-btn" onClick={onClose} aria-label="Close admin dashboard">✕</button>
        
        <div className="admin-dashboard-modern">
          {/* Enhanced Header */}
          <header className="admin-modern-header">
            <div className="header-content">
              <div className="header-left">
                <h1 className="dashboard-title">
                  <span className="title-icon">🛠️</span>
                  Admin Dashboard
                </h1>
                <p className="dashboard-subtitle">Manage your community with powerful tools</p>
              </div>
              <div className="header-actions">
                <button className="refresh-btn" onClick={fetchMembers} disabled={loading}>
                  <span className="btn-icon">🔄</span>
                  Refresh
                </button>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            {!loading && (
              <div className="stats-grid">
                <div className="stat-card total">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total Members</div>
                  </div>
                </div>
                <div className="stat-card active">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.active}</div>
                    <div className="stat-label">Active</div>
                  </div>
                </div>
                <div className="stat-card admins">
                  <div className="stat-icon">👑</div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.admins}</div>
                    <div className="stat-label">Administrators</div>
                  </div>
                </div>
                <div className="stat-card recent">
                  <div className="stat-icon">🆕</div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.recent}</div>
                    <div className="stat-label">This Week</div>
                  </div>
                </div>
                {stats.inactive > 0 && (
                  <div className="stat-card inactive">
                    <div className="stat-icon">⏸️</div>
                    <div className="stat-content">
                      <div className="stat-number">{stats.inactive}</div>
                      <div className="stat-label">Inactive</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Navigation Tabs */}
          <nav className="dashboard-nav">
            {[
              { id: 'members', label: 'Member Management', icon: '👥' },
              { id: 'messages', label: 'Messages', icon: '💬' },
              { id: 'resources', label: 'Resources', icon: '📁' },
              { id: 'activity', label: 'Activity Log', icon: '📊' }
            ].map((section) => (
              <button
                key={section.id}
                className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <main className="dashboard-main">
            {/* Members Section */}
            {activeSection === 'members' && (
              <div className="content-grid">
                <div className="content-panel members-panel">
                  <div className="panel-header">
                    <h2>
                      <span className="panel-icon">👥</span>
                      Member Directory
                    </h2>
                    <div className="panel-actions">
                      <span className="member-count">{members.length} members</span>
                    </div>
                  </div>
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading members...</p>
                    </div>
                  ) : (
                    <div className="panel-content">
                      <MemberList
                        members={members}
                        onSelect={handleSelect}
                        onMembersRefresh={fetchMembers}
                      />
                    </div>
                  )}
                </div>

                <div className="content-panel detail-panel">
                  {selectedMember ? (
                    <div className="panel-header">
                      <h2>
                        <span className="panel-icon">👤</span>
                        Member Details
                      </h2>
                      <button
                        className="back-btn"
                        onClick={() => setSelectedMember(null)}
                      >
                        ← Back to List
                      </button>
                    </div>
                  ) : (
                    <div className="panel-header">
                      <h2>
                        <span className="panel-icon">👆</span>
                        Select a Member
                      </h2>
                    </div>
                  )}
                  <div className="panel-content">
                    {selectedMember ? (
                      <MemberDetail
                        member={selectedMember}
                        onUpdated={handleMemberUpdated}
                        onDeleted={handleMemberDeleted}
                      />
                    ) : (
                      <div className="empty-selection">
                        <div className="empty-icon">👆</div>
                        <h3>Choose a member to view details</h3>
                        <p>Select any member from the list to see their profile, activity, and manage their account.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Section */}
            {activeSection === 'messages' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">💬</span>
                    Communication Center
                  </h2>
                </div>
                <div className="section-content">
                  <div className="messages-layout">
                    <div className="message-panel">
                      <h3>Send New Message</h3>
                      <MessagePanel
                        onMessageSent={() => {
                          console.log("Message sent");
                        }}
                        members={members}
                      />
                    </div>
                    <div className="message-history">
                      <h3>Recent Messages</h3>
                      <MessageList />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === 'resources' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">📁</span>
                    Resource Management
                  </h2>
                </div>
                <div className="section-content">
                  <div className="resource-layout">
                    <div className="upload-panel">
                      <h3>Upload Resources</h3>
                      <ResourceUploader onUploaded={() => alert("Resource uploaded successfully!")} />
                    </div>
                    <div className="resource-info">
                      <div className="info-card">
                        <h4>📋 Upload Guidelines</h4>
                        <ul>
                          <li>Maximum file size: 10MB</li>
                          <li>Supported formats: PDF, DOC, DOCX, ZIP</li>
                          <li>Files will be available to all members</li>
                          <li>Organize resources by category</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Section */}
            {activeSection === 'activity' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">📊</span>
                    System Activity
                  </h2>
                </div>
                <div className="section-content">
                  <div className="activity-layout">
                    <div className="activity-cards">
                      <div className="activity-card">
                        <h4>📈 System Statistics</h4>
                        <div className="activity-stats">
                          <div className="activity-stat">
                            <span className="stat-label">Total Registrations</span>
                            <span className="stat-value">{stats.total}</span>
                          </div>
                          <div className="activity-stat">
                            <span className="stat-label">Active This Week</span>
                            <span className="stat-value">{stats.recent}</span>
                          </div>
                          <div className="activity-stat">
                            <span className="stat-label">Admin Users</span>
                            <span className="stat-value">{stats.admins}</span>
                          </div>
                        </div>
                      </div>
                      <div className="activity-card">
                        <h4>🕒 Recent Activity</h4>
                        <div className="activity-feed">
                          <div className="activity-item">
                            <span className="activity-icon">👤</span>
                            <div className="activity-content">
                              <span className="activity-text">New member registered</span>
                              <span className="activity-time">2 hours ago</span>
                            </div>
                          </div>
                          <div className="activity-item">
                            <span className="activity-icon">📧</span>
                            <div className="activity-content">
                              <span className="activity-text">Bulk message sent to 15 members</span>
                              <span className="activity-time">1 day ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;