import React, { useEffect, useState } from "react";
import '../../styles/memberdasboard.css';

const MemberDashboard = ({ onClose }) => {
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    loadAvatars();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/member/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setMe(data.user || data);
      setMessages(data.messages || []);
      setEvents(data.events || []);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/member/avatar`, {
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
            <h3>👤 Profile Information</h3>
            
            <img
              src={me.avatar || "/assets/avatars/default.png"}
              alt={`${me.name}'s avatar`}
              className="profile-avatar"
              onError={(e) => {
                e.target.src = "/assets/avatars/default.png";
              }}
            />
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p><strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{me.name}</strong></p>
              <p className="muted">{me.email}</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                🎓 {me.collegeName || "College not specified"}
              </p>
            </div>

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
                  {messages.slice(0, 3).map(m => (
                    <li key={m._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#1e293b' }}>{m.subject}</strong>
                        <span className="small-text">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: '0.5rem 0', color: '#64748b' }}>{m.body}</p>
                    </li>
                  ))}
                  {messages.length > 3 && (
                    <li style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                      ...and {messages.length - 3} more messages
                    </li>
                  )}
                </ul>
              )}

              <h3 style={{ marginTop: '2rem' }}>🎯 Events Participated</h3>
              {events.length === 0 ? (
                <div className="muted" style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1'
                }}>
                  🎉 No events participated yet
                </div>
              ) : (
                <ul>
                  {events.map(ev => (
                    <li key={ev._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#1e293b' }}>{ev.title}</strong>
                          <p className="small-text" style={{ margin: '0.25rem 0 0 0' }}>
                            📅 {ev.date ? new Date(ev.date).toLocaleDateString() : 'Date not specified'}
                          </p>
                        </div>
                        <span style={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          Participated
                        </span>
                      </div>
                    </li>
                  ))}
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
