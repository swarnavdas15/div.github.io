import React, { useEffect, useState } from "react";
import MemberList from "./MemberList";
import MemberDetail from "./MemberDetail";
import MessagePanel from "./MessagePanel";
import MessageList from "./MessageList";
import ResourceUploader from "./ResourceUploader";
import '../../styles/admindasboard.css';

const AdminDashboard = ({ onClose }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, recent: 0 });
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
      
      // Calculate stats
      const total = membersList.length;
      const active = membersList.filter(m => m.status === 'active').length;
      const recent = membersList.filter(m => {
        const createdAt = new Date(m.createdAt);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt > oneWeekAgo;
      }).length;
      
      setStats({ total, active, recent });
    } catch (err) {
      console.error("Error fetching members:", err);
      alert("Could not load members. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (member) => {
    setSelectedMember(member);
  };

  // callbacks for optimistic updates
  const handleMemberUpdated = (updated) => {
    setMembers((prev) => prev.map(m => m._id === updated._id ? updated : m));
    if (selectedMember && selectedMember._id === updated._id) setSelectedMember(updated);
  };

  const handleMemberDeleted = (id) => {
    setMembers((prev) => prev.filter(m => m._id !== id));
    if (selectedMember && selectedMember._id === id) setSelectedMember(null);
  };

  return (
    <div className="admin-popup-overlay">
      <div className="admin-popup-content">
        <button className="admin-close-btn" onClick={onClose} aria-label="Close admin dashboard">✕</button>
        
        <header className="admin-dashboard-header">
          <h1>🛠️ Admin Dashboard</h1>
          <p className="admin-muted">Manage members, messages, and resources efficiently</p>
          
          {!loading && (
            <div className="admin-stats-container">
              <div className="admin-stat-item" style={{ textAlign: 'center' }}>
                <div className="admin-stat-number">{stats.total}</div>
                <div className="admin-stat-label">Total Members</div>
              </div>
              <div className="admin-stat-item" style={{ textAlign: 'center' }}>
                <div className="admin-stat-number">{stats.active}</div>
                <div className="admin-stat-label">Active</div>
              </div>
              <div className="admin-stat-item" style={{ textAlign: 'center' }}>
                <div className="admin-stat-number">{stats.recent}</div>
                <div className="admin-stat-label">This Week</div>
              </div>
            </div>
          )}
        </header>

        <div className="admin-grid-container">
          <div className="admin-panel">
            <h2>👥 Member Management</h2>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#64748b'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Loading members...
              </div>
            ) : (
              <div className="admin-member-list">
                <MemberList
                  members={members}
                  onSelect={handleSelect}
                  onMembersRefresh={fetchMembers}
                />
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>⚡ Quick Actions & Details</h2>
            
            {selectedMember ? (
              <div style={{ marginBottom: '2rem' }}>
                <MemberDetail
                  member={selectedMember}
                  onUpdated={handleMemberUpdated}
                  onDeleted={handleMemberDeleted}
                />
              </div>
            ) : (
              <div className="admin-empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👆</div>
                Select a member from the left panel to view their details and perform actions
              </div>
            )}
            
            <div className="admin-divider" />
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                color: '#374151',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📧 Communication Center
              </h3>
              <MessagePanel
                onMessageSent={() => {
                  console.log("Message sent");
                }}
                members={members}
              />
            </div>
            
            <div className="admin-divider" />
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                color: '#374151',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📁 Resource Upload
              </h3>
              <ResourceUploader onUploaded={() => alert("Resource uploaded successfully!")} />
            </div>
            
            <div className="admin-divider" />
            
            <div>
              <h3 style={{
                color: '#374151',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📬 Sent Messages
              </h3>
              <MessageList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;