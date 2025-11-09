import React, { useEffect, useState } from "react";
import '../../styles/memberdasboard.css';

const MemberDashboard = ({ onClose }) => {
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', collegeName: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    loadAvatars();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/member/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setMe(data.user || data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      alert("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadAvatars = () => {
    setAvatars([
      "/assets/avatars/avatar1.png",
      "/assets/avatars/avatar2.png",
      "/assets/avatars/avatar3.png",
      "/assets/avatars/avatar4.png",
    ]);
  };

  const setAvatar = async (path) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/member/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update avatar");
      setMe((m) => ({ ...m, avatar: path }));
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating avatar");
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: me?.name || '',
      collegeName: me?.collegeName || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/member/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      
      setMe((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ name: '', collegeName: '' });
  };

  if (loading) return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748b',
          fontSize: '1.1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          Loading your profile...
        </div>
      </div>
    </div>
  );

  if (!me) return <div className="popup-overlay"><div className="popup-content">Unable to load profile</div></div>;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose} aria-label="Close dashboard">✕</button>
        
        <header className="dashboard-header">
          <h1>Welcome back, {me.name}! 👋</h1>
          <p className="muted">Your personal dashboard</p>
        </header>

        <div className="grid-2">
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>👤 Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleEditProfile}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      backgroundColor: saving ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {saving ? '💾 Saving...' : '✅ Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
            
            <img
              src={me.avatar || "/assets/avatars/default.png"}
              alt={`${me.name}'s avatar`}
              className="profile-avatar"
              onError={(e) => {
                e.target.src = "/assets/avatars/default.png";
              }}
            />
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px', margin: '0 auto' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', color: '#374151' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', color: '#374151' }}>
                      College Name
                    </label>
                    <input
                      type="text"
                      value={editForm.collegeName}
                      onChange={(e) => setEditForm({ ...editForm, collegeName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{me.name}</strong></p>
                  <p className="muted">{me.email}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    🎓 {me.collegeName || "College not specified"}
                  </p>
                </div>
              )}
            </div>

            {isEditing && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#374151' }}>🖼️ Choose Your Avatar</h4>
                <div className="avatar-grid">
                  {avatars.map((a, index) => (
                    <img
                      key={`${a}-${index}`}
                      src={a}
                      alt={`Avatar option ${index + 1}`}
                      className={`avatar-option ${me.avatar === a ? "selected" : ""}`}
                      onClick={() => setAvatar(a)}
                      title={`Select avatar ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <h3>📧 Recent Messages</h3>
              {messages.length === 0 ? (
                <div className="muted" style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1'
                }}>
                  📭 No messages yet
                </div>
              ) : (
                <ul style={{ marginBottom: '2rem' }}>
                  {(!showAllMessages ? messages.slice(0, 3) : messages).map(m => (
                    <li
                      key={m._id}
                      onClick={() => setSelectedMessage(m)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📬 {m.subject || 'No Subject'}
                          </strong>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginTop: '0.25rem'
                          }}>
                            From: Administrator • {new Date(m.createdAt).toLocaleDateString()} at {new Date(m.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {new Date(m.createdAt) > new Date(Date.now() - 24*60*60*1000) ? 'New' : 'Read'}
                        </span>
                      </div>
                      <p style={{
                        margin: '0.5rem 0',
                        color: '#475569',
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {m.content || m.body || 'No content'}
                      </p>
                      {selectedMessage && selectedMessage._id === m._id && (
                        <div style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          padding: '0.75rem'
                        }}>
                          <p style={{
                            margin: 0,
                            color: '#374151',
                            fontSize: '0.875rem',
                            lineHeight: '1.5'
                          }}>
                            {m.content || m.body}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                  {messages.length > 3 && !showAllMessages && (
                    <li style={{
                      textAlign: 'center',
                      color: '#64748b',
                      fontStyle: 'italic',
                      padding: '0.5rem'
                    }}>
                      ...and {messages.length - 3} more messages
                    </li>
                  )}
                  {messages.length > 3 && (
                    <li style={{ textAlign: 'center', marginTop: '1rem' }}>
                      <button
                        onClick={() => setShowAllMessages(!showAllMessages)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        {showAllMessages ? 'Show Less' : 'Show All Messages'}
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
