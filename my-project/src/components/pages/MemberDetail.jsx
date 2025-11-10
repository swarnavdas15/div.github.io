import React, { useState } from "react";
import "../../styles/admindasboard.css";

/**
 * Enhanced Member Detail Component with user-friendly formatting
 * props:
 *  - member (object)
 *  - onUpdated(updatedMember)
 *  - onDeleted(memberId)
 */
export default function MemberDetail({ member, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const token = localStorage.getItem("token");

  const toggleDeactivate = async () => {
    if (!confirm(`Toggle active status for ${member.name}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/members/${member._id}/deactivate`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");
      onUpdated(data.user || data);
      alert("Status updated");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/members/${member._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({message:'Delete failed'}));
        throw new Error(body.message || "Delete failed");
      }
      onDeleted(member._id);
      alert("Member deleted");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwd || pwd.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/members/${member._id}/password`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: pwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      alert("Password changed");
      setPwd("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="member-detail-enhanced">
      {/* Enhanced Header with avatar and status indicators */}
      <div className="member-header-card">
        <div className="member-avatar-section">
          <div className="avatar-container">
            <img
              src={member.avatar || '/assets/avatars/avatar1.jpg'}
              alt={`${member.name}'s avatar`}
              className="member-avatar"
              onError={(e) => {
                e.target.src = '/assets/avatars/avatar1.jpg';
              }}
            />
            <div className={`status-indicator ${member.isActive ? 'active' : 'inactive'}`}></div>
          </div>
          <div className="member-basic-info">
            <h2 className="member-name">{member.name}</h2>
            <p className="member-email">
              <i className="icon">📧</i>
              {member.email}
            </p>
            <p className="member-college">
              <i className="icon">🎓</i>
              {member.collegeName || 'College not specified'}
            </p>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="status-badges">
          <div className={`status-badge role-badge ${member.role}`}>
            <i className="icon">👤</i>
            {member.role?.toUpperCase() || 'MEMBER'}
          </div>
          <div className={`status-badge activity-badge ${member.isActive ? 'active' : 'inactive'}`}>
            <i className="icon">{member.isActive ? '✅' : '❌'}</i>
            {member.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'activity', label: 'Activity', icon: '📈' },
          { id: 'security', label: 'Security', icon: '🔐' },
          { id: 'messages', label: 'Messages', icon: '💬' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Account Information Card */}
            <div className="info-card">
              <div className="card-header">
                <h3><i className="icon">📊</i>Account Information</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Member Since</label>
                  <div className="info-value">
                    {member.createdAt ? (
                      <>
                        <i className="icon">📅</i>
                        {new Date(member.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </>
                    ) : 'N/A'}
                  </div>
                </div>
                <div className="info-item">
                  <label>Last Updated</label>
                  <div className="info-value">
                    {member.updatedAt ? (
                      <>
                        <i className="icon">🔄</i>
                        {new Date(member.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </>
                    ) : 'N/A'}
                  </div>
                </div>
                <div className="info-item">
                  <label>Authentication Type</label>
                  <div className="info-value">
                    <i className="icon">🔑</i>
                    {member.provider ?
                      `OAuth (${member.provider.charAt(0).toUpperCase() + member.provider.slice(1)})` :
                      'Email & Password'
                    }
                  </div>
                </div>
                <div className="info-item">
                  <label>Total Messages</label>
                  <div className="info-value">
                    <i className="icon">💌</i>
                    {member.messages?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Events Participation Card */}
            {member.eventsParticipated && member.eventsParticipated.length > 0 && (
              <div className="info-card events-card">
                <div className="card-header">
                  <h3><i className="icon">🎯</i>Events Participated</h3>
                </div>
                <div className="events-list">
                  {member.eventsParticipated.map((event, index) => (
                    <div key={index} className="event-item">
                      <i className="icon">🏆</i>
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="info-card actions-card">
              <div className="card-header">
                <h3><i className="icon">⚡</i>Quick Actions</h3>
              </div>
              <div className="action-buttons">
                <button
                  className={`action-btn ${member.isActive ? 'deactivate' : 'activate'}`}
                  onClick={toggleDeactivate}
                  disabled={loading}
                >
                  <i className="icon">{member.isActive ? '⏸️' : '✅'}</i>
                  {loading ? 'Processing...' : (member.isActive ? 'Deactivate User' : 'Activate User')}
                </button>
                <button
                  className="action-btn delete"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <i className="icon">🗑️</i>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-tab">
            <div className="info-card security-card">
              <div className="card-header">
                <h3><i className="icon">🔐</i>Change Password (Admin)</h3>
              </div>
              <form onSubmit={changePassword} className="password-form">
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-container">
                    <i className="icon">🔒</i>
                    <input
                      id="new-password"
                      type="password"
                      value={pwd}
                      onChange={(e)=>setPwd(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  <i className="icon">🔑</i>
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-tab">
            {member.messages && member.messages.length > 0 ? (
              <div className="info-card messages-card">
                <div className="card-header">
                  <h3><i className="icon">💬</i>Recent Messages ({member.messages.length})</h3>
                </div>
                <div className="messages-list">
                  {member.messages.slice(0, 5).map((message, index) => (
                    <div key={index} className="message-item">
                      <div className="message-header">
                        <span className="message-subject">{message.subject}</span>
                        <span className="message-date">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="message-content">
                        {message.content?.slice(0, 150)}
                        {message.content?.length > 150 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                  {member.messages.length > 5 && (
                    <div className="more-messages">
                      ...and {member.messages.length - 5} more messages
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <i className="icon">📭</i>
                <p>No messages found for this member</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <div className="info-card activity-card">
              <div className="card-header">
                <h3><i className="icon">📈</i>Activity Overview</h3>
              </div>
              <div className="activity-stats">
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-number">{member.messages?.length || 0}</div>
                    <div className="stat-label">Messages Received</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-number">{member.eventsParticipated?.length || 0}</div>
                    <div className="stat-label">Events Participated</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-number">
                      {member.createdAt ?
                        Math.floor((new Date() - new Date(member.createdAt)) / (1000 * 60 * 60 * 24)) : 0
                      }
                    </div>
                    <div className="stat-label">Days as Member</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
